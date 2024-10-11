import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roleRoute from './routes/role.route.js';
import authRoute from './routes/auth.route.js';
import libRoute from './routes/lib.route.js';
import mcRoute from './routes/mc.route.js';
import canteenRoute from './routes/canteen.route.js';
import cors from "cors";
import cookieParser from 'cookie-parser';
import voteRoute from './routes/votes.route.js';
import userRoute from './routes/user.route.js';

// Cookie parser middleware
const app = express();
app.use(cookieParser());

dotenv.config();
app.use(express.json());

// CORS middleware configuration
app.use(cors());

app.use(cors({
	origin: '*',
}));

app.use("/", databaseMiddleware);
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/library", libRoute);
app.use("/api/medical-center", mcRoute);
app.use("/api/canteen", canteenRoute);
app.use("/api/votes", voteRoute);
app.use("/api/user/", userRoute);

app.get("/", (req, res) => {
	res.send("Server is responding...");
});

// Database connection middleware:nivindulakshitha
async function databaseMiddleware(req, res, next) {
	const databaseConnection = await databaseConnector(res);
	if (databaseConnection) {
		if (req.url === "/api") {
			res.status(200).json({
				success: true,
				message: "Database connection successful"
			});
		} else {
			console.log("Database connection established, redirecting to the next: ", req.url);
			next();
		}
	} else {
		res.status(500).json({
			success: false,
			message: "Failed to connect to the database."
		});
	}
};

app.use((obj, req, res, next) => {
	const statusCode = obj.status || 500;
	const message = obj.message || "something went wrong..";
	return res.status(statusCode).json({
		success: [200, 201, 204].some(a => a === obj.status) ? true : false,
		status: statusCode,
		message: message,
		data: obj.data,
		stack: obj.stack
	})
})

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

function databaseConnector(res) {
	return new Promise((resolve, reject) => {
		mongoose.connect(
			process.env.MONGO_URL
		).then(() => {
			resolve(true);
		}).catch((error) => {
			console.log("Connection failed!", error);
			return res.status(500).json({
				success: false,
				error: error.message,
				code: error.code,
				message: "Failed to connect to the database."
			})
		});
	});
}