const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.util');
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const register = async(data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });
    return user;
}

const verifyOtp = async (email, otp) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Email does not exist');
  if (user.otp !== otp) throw new Error('Wrong OTP');
  if (new Date() > user.otpExpiresAt) throw new Error('OTP expired');

  await prisma.user.update({
    where: { email },
    data: { otp: null, otpExpiresAt: null }
  });

  return user;
};

const login = async(data) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid password');
    };
    const token = generateToken({ id: user.id, role: user.role });
    return token;
}

const findOrCreateUser = async (profile) => {
  let user = await prisma.user.findUnique({
    where: { googleId: profile.id }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.emails[0].value,
        name: profile.displayName,
        googleId: profile.id,
        avatarUrl: profile.photos[0].value,
        password: '',
      }
    });
  }

  return user;
}

module.exports = { verifyOtp, register, login, findOrCreateUser };
