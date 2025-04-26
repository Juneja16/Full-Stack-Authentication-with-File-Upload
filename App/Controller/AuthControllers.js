import { v2 as cloudinary } from "cloudinary";
import FullStackModel from "../Model/FullStackModel.js";

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

    await FullStackModel.create({
      username,
      email,
      password,
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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const myuser = await FullStackModel.findOne({
      email: email,
      password: password,
    });

    if (myuser) {
      res.render("Profile", { myuser });
    } else {
      res.render("Login", { url: null, error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.render("Login", { url: null, error: "Login failed" });
  }
};
