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

app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/library", libRoute);
app.use("/api/medical-center", mcRoute);
app.use("/api/canteen", canteenRoute);
app.use("/api/votes", voteRoute);


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

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`API is running on ${process.env.BASE_URL}:${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });