import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import News from '../models/News.js';
import { notifyAllUsers } from './notificationController.js';



export const createNews = async (req, res, next) => {
    const { title, subtitle, content, image, link } = req.body;

    try {
        const newsItem = new News({
            title,
            subtitle,
            content,
            image,
            link
        });

        await newsItem.save();

        await notifyAllUsers(`${title}`, 'news');

        return next(CreateSuccess(201, "News item created successfully"));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};


export const getNews = async (req, res, next) => {
    try {
        const newsItems = await News.find().sort({ date: -1 });
        return next(CreateSuccess(200, "News items retrieved successfully", newsItems));
    } catch (error) {
        return next(CreateError(500, error.message));
    }
};
