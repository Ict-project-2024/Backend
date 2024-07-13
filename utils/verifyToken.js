import { CreateError } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) {

        return next(CreateError(500, "Not authorized.."));
    }

    jwt.verify(token,
        process.env.JWT_SECRET,
        (err, user) => {
            if (err) {
                return next(CreateError(500, "invalide token.."));
            } else {
                req.user = user;
            }

            next();
        });
};

export const verifyUser = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.isAdmin) {
                next();
            }

        })
    } catch (error) {
        return next(CreateError(500, "You are not authorized.."));
    }
}

export const verifyAdmin = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (req.user.isAdmin) {
                next();
            }

        })
    } catch (error) {
        // res.status(500).json({ message: error.message });
        return next(CreateError(500, "You are not an Admin.."));
    }
} 