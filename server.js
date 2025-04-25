import express from "express";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import FullStackModel from "./App/Model/FullStackModel.js";
import { connectDB } from "./App/Config/database.js";

dotenv.config();
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const PORT = process.env.PORT || 5020;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "./App/views"));

app.get("/", (req, res) => {
  res.render("Register", {
    url: null,
  });
});
app.get("/login", (req, res) => {
  res.render("Login", { url: null });
});

const storage = multer.diskStorage({
  //   destination: path.join(path.resolve(), "./App/public/uploads"),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.post("/register", upload.single("file"), async (req, res) => {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  const filepath = req.file.path;
  const { username, email, password } = req.body;

  const cloudinaryResponse = await cloudinary.uploader.upload(filepath, {
    folder: "FULL STACK AUTHENTICATION WITH FILE  uploads",
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
  //   res.json({ message: "File uploaded successfully", cloudinaryResponse });
  res.redirect("/login");
  //   res.render("index", {
  //     url: imageUrl,
  //   });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let myuser = await FullStackModel.findOne({
    email: email,
    password: password,
  });
  if (myuser) {
    res.render("Profile.ejs", {
      myuser,
    });
  } else {
    res.render("Login", {
      url: null,
    });
  }
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
