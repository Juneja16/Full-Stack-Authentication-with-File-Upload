import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./App/Config/database.js";
import authRoutes from "./App/Routes/AuthRoutes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5010;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "./App/views"));

// Routes
app.use("/", authRoutes);

// Connect to database and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
