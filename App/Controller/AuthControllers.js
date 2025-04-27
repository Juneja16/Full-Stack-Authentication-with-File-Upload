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
    // Destructure file and form fields
    const { filepath, filename } = req.file;
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!filepath || !username || !email || !password) {
      return res
        .status(400)
        .render("Register", { url: null, error: "All fields are required" });
    }

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      folder: "User_Uploads",
    });

    // Extract required fields from the upload result
    const imageUrl = uploadResult.secure_url; // Always use 'secure_url' for HTTPS
    const publicId = uploadResult.public_id;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await FullStackModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .render("Register", { url: null, error: "Email already registered" });
    }

    // Save user data to database
    await FullStackModel.create({
      username,
      email,
      password: hashedPassword,
      imageUrl,
      publicId,
      filename,
    });

    // Redirect user to login page
    res.redirect("/login");
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).render("Register", {
      url: null,
      error: "Registration failed. Please try again.",
    });
  }
};

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
