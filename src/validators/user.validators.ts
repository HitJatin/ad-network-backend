import { RequestHandler } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";

const JWTKEY: string = process.env.JWTKEY || "MYNAME-IS-HELLOWORLD";

export const validateSignUp: RequestHandler = async (req, res, next) => {
    try {
        const signUpSchema = Joi.object({
            firstName: Joi.string()
                .pattern(/^[a-zA-Z ]+$/),

            lastName: Joi.string()
                .pattern(/^[a-zA-Z ]+$/),

            email: Joi.string()
                .email()
                .required(),
                
            phone: Joi.string(),

            type: Joi.string(),

            password: Joi.string()
                .min(8)
                .max(20)
                .required()
        })

        const value = await signUpSchema.validateAsync(req.body);
        const { email, phone } = value;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists!",
                data: [],
            });
        }
        if(phone) {
            const checkPhone = await User.findOne({ where: { phone } });
            if (checkPhone) {
                return res.status(404).json({
                    success: false,
                    message: "User with this Phone number already Exist!",
                    data: [],
                });
            }
        }
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
}

export const validateResendTokenInfo: RequestHandler = async (req, res, next) => {
    try {
        const resendTokenSchema = Joi.object({
            email: Joi.string()
                .email()
                .required()
        })

        const value = await resendTokenSchema.validateAsync(req.body);
        const { email } = value;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No account exists with this email",
                data: [],
            });
        }
        else if (user.isVerified == 1) {
            return res.status(400).json({
                success: false,
                message: "Your accound is already verified!",
                data: [],
            });
        }
        req.body.user = user;
        next();

    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
};

export const validateActivationInfo: RequestHandler = async (req, res, next) => {
    try {
        const activationSchema = Joi.object({
            token: Joi.string()
                .required()
        })
        const value = await activationSchema.validateAsync(req.query);
        const verifyUser = await User.findOne({ where: { token: value.token } });
        if (verifyUser?.token) {
            jwt.verify(verifyUser.token, JWTKEY, async (err, decodedToken: any) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message,
                        data: [],
                    });
                }

                req.body.decodedToken = decodedToken;
                req.body.user = verifyUser;
                next();
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: `Publisher not found`,
                data: []
            });
        }
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: [],
        });
    }
};

export const validateSigninInfo: RequestHandler = async (req, res, next) => {
    try {
        const signinSchema = Joi.object({
            email: Joi.string()
                .email()
                .required(),

            password: Joi.string()
                .min(8)
                .max(30)
                .required()
        })
        const value = await signinSchema.validateAsync(req.body)
        const user = await User.findOne({ where: { email: value.email } });
        if (user) {
            const passMatch = await bcrypt.compare(value.password, user.password);
            if (passMatch) {
                if (user.isVerified === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Please verify your account!",
                        data: [],
                    });
                }
                req.body.user = user;
                next();
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Email/Username or Password is incorrect!",
                    data: [],
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "Email/Username or Password is incorrect!",
                data: [],
            });
        }
    } catch (error: any) {
        return res.status(504).json({
            success: false,
            message: error.message,
            data: ["in validator"],
        });
    }
};