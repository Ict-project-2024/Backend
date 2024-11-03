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
import saasToken from './routes/saasToken.route.js';

// Cookie parser middleware
const app = express();
app.use(cookieParser());

dotenv.config();
app.use(express.json());

// CORS middleware configuration
app.use(cors({
	origin: ['http://localhost:8080', 'https://unimo.vercel.app'],
	credentials: true
}));

app.use("/", databaseMiddleware);
app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/library", libRoute);
app.use("/api/medical-center", mcRoute);
app.use("/api/canteen", canteenRoute);
app.use("/api/votes", voteRoute);
app.use("/api/user/", userRoute);
app.use('/api/sas-token',saasToken);

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
	console.log(`Server is running on ${process.env.PORT}`);
});

async function databaseConnector(retries = 5, delay = 2000) {
	while (retries) {
	  try {
		await mongoose.connect(process.env.MONGO_URL);
		return true;
	  } catch (err) {
		console.error("Failed to connect to the database. Retrying...", retries);
		retries -= 1;
		await new Promise(res => setTimeout(res, delay));
	  }
	}
	return false;
  }
  