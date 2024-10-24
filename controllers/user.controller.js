import User from "../models/User.js";

export const retrieveUsers = async (req, res, next) => {
    const { userId, teNumber } = req.body;
    try {
        const users = await User.findOne(userId !== undefined ? { _id: userId } : { TeNumber: teNumber.toLowerCase() });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}