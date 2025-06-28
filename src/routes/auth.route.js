const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { validationResult } = require('express-validator');
const validator = require('../validators/auth.validator');
const { verifyToken } = require('../middlewares/auth.middleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/register', validator.registerValidator, validate, authController.register)
      .get('/me', verifyToken, authController.getCurrentUser)
      .post('/confirm-otp', authController.confirmOtp)
      .post('/login', validator.loginValidator, validate, authController.login)
      .post('/logout', authController.logout)
      .get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
      .get('/google/callback',
        passport.authenticate('google', { session: false, failureRedirect: '/login' }),
        authController.googleCallback
     );

module.exports = router;
