import express from "express";
import {
  loginUser,
  profileView,
  registerUser,
  renderLogin,
  renderRegister,
} from "../Controller/AuthControllers.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.get("/", renderRegister);
router.get("/login", renderLogin);
router.post("/register", upload.single("file"), registerUser);
router.post("/login", loginUser);
router.get("/profile", profileView);
export default router;
