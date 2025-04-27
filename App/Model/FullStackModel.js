import mongoose from "mongoose";

const FullStackFileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const FullStackModel = mongoose.model("FullStackModel", FullStackFileSchema);
export default FullStackModel;
