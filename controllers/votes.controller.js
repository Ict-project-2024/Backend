import UserVote from "../models/UserVote.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const getUserVotes = async (req, res, next) => {
    const { userId } = req.body;
    try {
        let userVote = await UserVote.findOne({ userId: userId});

        if (!userVote) {
            return next(CreateError(404, "User not found", userId));
        }

        return next(CreateSuccess(200, "User votes data fetched successfully!", userVote));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};


export const getAllVotes = async (req, res, next) => {
    try {
        let votes = await UserVote.find();
        if (!votes) {
            return next(CreateError(204, "No votes found"));
        }

        return next(CreateSuccess(200, "All votes data fetched successfully!", votes));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
}
