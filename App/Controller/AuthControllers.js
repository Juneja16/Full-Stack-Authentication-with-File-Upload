import { v2 as cloudinary } from "cloudinary";
import FullStackModel from "../Model/FullStackModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const renderRegister = (req, res) => {
  res.render("Register", { url: null });
};

export const renderLogin = (req, res) => {
  res.render("Login", { url: null });
};

export const registerUser = async (req, res) => {
  try {
    const filepath = req.file.path;
    const { username, email, password } = req.body;

    const cloudinaryResponse = await cloudinary.uploader.upload(filepath, {
      folder: "FULL STACK AUTHENTICATION WITH FILE uploads",
    });

    const imageUrl = cloudinaryResponse.secure_url;
    const publicId = cloudinaryResponse.public_id;
    const filename = req.file.filename;

    const hashpassword = await bcrypt.hash(password, 10);

    await FullStackModel.create({
      username,
      email,
      password: hashpassword,
      imageUrl,
      publicId,
      filename,
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.render("Register", { url: null, error: "Registration failed" });
  }
};

// import cookieParser from "cookie-parser"; // make sure you have this middleware in your app.js

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const myuser = await FullStackModel.findOne({ email });
    if (!myuser) {
      return res.render("Login", { url: null, error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, myuser.password);

    if (isPasswordValid) {
      const myjsontoken = jwt.sign({ id: myuser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Set the token in a cookie
      res.cookie("token2", myjsontoken, {
        httpOnly: true, // JS cannot access it — protection against XSS
        // secure: process.env.NODE_ENV === "production", // true if on HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.redirect("/Profile");
    } else {
      res.render("Login", { url: null, error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.render("Login", { url: null, error: "Login failed" });
  }
};

export const profileView = async (req, res) => {
  try {
    console.log("Profile view request received");

    const token = req.cookies.token2; // Assuming you're using cookies to store the token
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    console.log("My Token :", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in the database
    const user = await FullStackModel.findById(decoded.id);
    if (!user) {
      return res.status(401).send("Invalid token. User not found.");
    }

    console.log("User found:", user);

    res.render("Profile", { url: user.imageUrl, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
