import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import roleRoute from './routes/role.route.js';
import authRoute from './routes/auth.route.js';
import libRoute from './routes/lib.route.js';
import mcRoute from './routes/mc.route.js';
import canteenRoute from './routes/canteen.route.js';
import voteRoute from './routes/votes.route.js';
import userRoute from './routes/user.route.js';

import notificationRoute from './routes/notificationRoutes.js';
import { verifyUser ,verifyToken } from './utils/verifyToken.js';
import newsRoute from './routes/news.route.js';
import saasTokenRoute from './routes/saasToken.route.js';

// Initialize dotenv for environment variables
dotenv.config();


const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());

// CORS configuration with credentials
app.use(cors({
	origin: ['http://localhost:8080', 'https://unimo.vercel.app', 'https://unimo-guhmgefpaufhapfm.southeastasia-01.azurewebsites.net'],
	credentials: true
}));

// Database connection middleware
app.use("/", databaseMiddleware);

// Route handling
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


// Base route
app.get("/", (req, res) => {
	res.send("Server is responding...");
});

// Database connection middleware
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

// Error handling middleware
app.use((err, req, res, next) => {
	const statusCode = err.status || 500;
	const success = [200, 201, 204].includes(statusCode);
	res.status(statusCode).json({
		success,
		status: statusCode,
		message: err.message || "Something went wrong.",
		data: err.data,
		stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Only show stack in development
	});
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Database connection function with retry logic
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