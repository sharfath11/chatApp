import express from "express"
import { createChat, findChat, findUserChat } from "../Controllers/chatController.js";
import events from 'events';
events.EventEmitter.defaultMaxListeners = 20; // Increase the limit if needed
const route=express.Router();
route.post("/",createChat);
route.get("/:userId",findUserChat);
route.get("/find/:firstId/:secondId",findChat);
export default route
