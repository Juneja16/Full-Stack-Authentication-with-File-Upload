import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect(
      "mongodb://127.0.0.1:27017/FULL_STACK_AUTHENTICATION_WITH_FILE_UPLOAD_14_4_2025"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}
