import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoute from "./Routes/userRouter.js"
import chatRoute from './Routes/chatRoutes.js';
import messageRoute from "./Routes/messageRoute.js"
dotenv.config(); 

const PORT = process.env.PORT || 5000; 
const URI = process.env.MONGODB_URI;

const app = express();
app.use(cors())
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/users",userRoute)
app.use("/api/chats",chatRoute)
app.use("/api/messages",messageRoute)

// Connect to MongoDB
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully.');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
