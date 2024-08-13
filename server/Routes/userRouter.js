import express from "express"
import { findUser, getUsers, loginUser, registerUser } from "../Controllers/userController.js";
const route=express.Router();
route.post("/register",registerUser);
route.post("/login",loginUser);
route.get("/find/:userId",findUser);
route.get("/",getUsers);
export default route