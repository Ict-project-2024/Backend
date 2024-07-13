import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roleRoute from './routes/role.route.js';
import authRoute from './routes/auth.route.js';

const app = express();

dotenv.config();
app.use(express.json());

app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute)


app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const message = obj.message || "something went wrong..";
  return res.status(statusCode).json({
    success: [200, 201, 204].some(a => a === obj.status) ? true : false,
    status: statusCode,
    message: message,
    data:obj.data,
    stack: obj.stack
  })
})

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });