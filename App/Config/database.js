import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect(
      "mongodb+srv://102harekrishna:QlKZ7Uo8U5G7Njb2@cluster23-4-25.zrebqly.mongodb.net/FILE_UPLOAD_26_4_2025?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}

// "mongodb://127.0.0.1:27017/FULL_STACK_AUTHENTICATION_WITH_FILE_UPLOAD_14_4_2025"
