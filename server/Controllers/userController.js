import UserModel from "../Models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


// Token creation function
const createToken = (_id) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }
    return jwt.sign({ _id }, JWT_SECRET_KEY, { expiresIn: '1h' });
  };
export const registerUser = async (req, res) => {
  try {
    // // Token creation function
    // const createToken = (_id) => {
    //   const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    //   if (!JWT_SECRET_KEY) {
    //     throw new Error('JWT_SECRET_KEY is not defined');
    //   }
    //   return jwt.sign({ _id }, JWT_SECRET_KEY, { expiresIn: '1h' });
    // };

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json("User already exists...");
    }

    // Validate input
    if (!name || !email || !password) {
      console.log(name,email,password,'hghgyug');
      
      return res.status(400).json("All fields are required...");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Email is not valid...");
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password should be strong...");
    }

    // Create a new user
    const user = new UserModel({ name, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user
    await user.save();

    // Create a token
    const token = createToken(user._id);

    // Respond with user data and token
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
;
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json("Invalid email or password");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json("Invalid email or password");
        }

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const findUser = async (req, res) => {
    const userId = req.params.userId.trim(); // Remove any leading/trailing whitespace
    console.log(userId);

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
