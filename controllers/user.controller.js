import User from "../models/User.js";

export const retrieveUsers = async (req, res, next) => {
    const { userId } = req.body;
    try {
        const users = await User.findOne({ _id: userId });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}