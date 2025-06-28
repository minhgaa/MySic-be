const { body } = require('express-validator');
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

exports.registerValidator = [
    body('name')
        .notEmpty().withMessage('Name cannot be empty')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('email')
        .isEmail().withMessage('Email is not valid')
        .custom(async (email) => {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error('Email already exists');
            }
        }), ,

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 number'),,

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm password does not match password');
            }
            return true;
        })
];

exports.loginValidator = [
    body('email')
        .isEmail().withMessage('Email is not valid')
        .notEmpty().withMessage('Email cannot be empty'),

    body('password')
        .notEmpty().withMessage('Password cannot be empty')
];
