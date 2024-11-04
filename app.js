import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import roleRoute from './routes/role.route.js';
import authRoute from './routes/auth.route.js';
import libRoute from './routes/lib.route.js';
import mcRoute from './routes/mc.route.js';
import canteenRoute from './routes/canteen.route.js';
import voteRoute from './routes/votes.route.js';
import userRoute from './routes/user.route.js';
import notificationRoute from './routes/notificationRoutes.js';
import newsRoute from './routes/news.route.js';
import saasTokenRoute from './routes/saasToken.route.js';

import { verifyUser, verifyToken } from './utils/verifyToken.js';

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
	origin: ['http://localhost:8080', 'https://unimo.vercel.app', 'https://unimo-guhmgefpaufhapfm.southeastasia-01.azurewebsites.net'],
	credentials: true
}));

// Database middleware
app.use("/", databaseMiddleware);

// Routes
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/library", libRoute);
app.use("/api/medical-center", mcRoute);
app.use("/api/canteen", canteenRoute);
app.use("/api/votes", voteRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/news", newsRoute);
app.use("/api/user", userRoute);
app.use('/api/sas-token', saasTokenRoute);

app.get("/", (req, res) => res.send("Server is responding..."));

// Error handling
app.use((err, req, res, next) => {
	const statusCode = err.status || 500;
	res.status(statusCode).json({
		success: statusCode < 400,
		status: statusCode,
		message: err.message || "Something went wrong.",
		data: err.data,
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
	});
});

async function databaseMiddleware(req, res, next) {
	const isConnected = await databaseConnector();
	if (!isConnected) {
		return res.status(500).json({
			success: false,
			message: "Failed to connect to the database."
		});
	}
	next();
}

async function databaseConnector(retries = 5, delay = 2000) {
	while (retries > 0) {
		try {
			await mongoose.connect(process.env.MONGO_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
			console.log("Connected to MongoDB successfully");
			return true;
		} catch (err) {
			console.error(`Database connection failed. Retries left: ${retries - 1}`);
			retries -= 1;
			await new Promise(res => setTimeout(res, delay));
		}
	}
	console.error("All retries exhausted. Database connection failed.");
	return false;
}

export default app;
