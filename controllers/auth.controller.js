import Role from "../models/Role.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js"
import crypto from "crypto"
import { sendVerificationEmail } from "../utils/emailUtils.js"


export const register = async (req, res, next) => {

    try {
        const role = await Role.find({ role: 'user' });
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.universityEmail,
            TeNumber: req.body.registrationNumber.toLowerCase(),
            gender: req.body.gender,
            mobileNumber: req.body.phoneNumber,
            password: hashPassword,
            profileImage: req.body.headshotUrl,
            roles: role
        });

        // Generate verification token
        newUser.verificationToken = crypto.randomBytes(32).toString('hex');
        newUser.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await newUser.save();

        // Send verification email
        await sendVerificationEmail(newUser.email, newUser.verificationToken);


        // res.status(200).json(newUser);
        return next(CreateSuccess(200, "User registration succesfull! Please check your email to verify your account."));

    } catch (error) {
        res.status(500).json({ message: error.message });
        // return next(CreateError(400, "bad request"));
    }
}


export const registerAdmin = async (req, res, next) => {

    try {
        const role = await Role.find({});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hashPassword,
            isAdmin: true,
            roles: role
        });
        await newUser.save();
        // res.status(200).json(newUser);
        return next(CreateSuccess(200, "Admin registration succesfull.."));

    } catch (error) {
        // res.status(500).json({ message: error.message });
        return next(CreateError(400, "bad request"));
    }
}

export const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email: email }).populate("roles", "role");

        const { roles } = user;

        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }


        const validePassword = await bcrypt.compare(req.body.password, user.password);

        if (validePassword) {
            // return res.status(201).json({ message: 'login success..'} );

            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, roles: roles }, process.env.JWT_SECRET)

            // return next(CreateSuccess(200,"User login succesfull.."));
            res.cookie("access_token", token, { httpOnly: true }).status(200).json({
                status: 200,
                message: "Login Success",
                ...user._doc, 
                success: true
            })
        } else {

            // return res.status(401).json({ message: 'Invalid username or password'});
            return next(CreateError(400, "Invalid username or password"));
        }

        // return res.status(401).json({ message: 'Invalid username or password'});

    } catch (error) {
        return next(CreateError(400, "Invalid username"));

    }
}

export const verifyEmail = async (req, res, next) => {

    try {
        const { token } = req.query;
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        // res.send('Email verified successfully!');
        return next(CreateSuccess(200, "Email verified successfully!", user));
    } catch (error) {
        res.status(400).send({ error: error.message });
    }

}