import express from "express"
import { getMessage,createMessage } from "../Controllers/messageController.js";
// import events from 'events';
// events.EventEmitter.defaultMaxListeners = 20; // Increase the limit if needed
const route=express.Router();
route.post("/",createMessage);
route.get("/:chatId",getMessage);

export default route
