const authService = require('../services/auth.service');
const { generateToken } = require('../utils/jwt.util');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const resendOtp = async(req, res) => {
    try {
        await authService.resendOtp(req.body);
        res.status(201).json({
            message: 'Resend email successfully',
        })
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const confirmOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await authService.verifyOtp(email, otp);
        const token = generateToken({id: user.id, role: user.role});
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ message: 'Confirm account successfully !', token });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ message: 'User logged in successfully' });
    } catch (error) {
        res.status(401).json({
            error: error.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            role: user.role,
            id: user.id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createAt: user.createAt
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            message: 'User logged out successfully',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

const googleCallback = async (req, res) => {
    const token = generateToken({id: req.user.id, role: req.user.role});

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    });
    res.redirect('http://localhost:5173');
}

module.exports = { resendOtp, register, login, googleCallback, logout, getCurrentUser, confirmOtp };