import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
});

// Create the model
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
