import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roleRoute from './routes/role.route.js';

const app = express();

dotenv.config();
app.use(express.json());

app.use("/api/role", roleRoute);

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