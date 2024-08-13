import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    chatId:String,
    senderId:String,
    senderName:String,
    text:String,
   
},
{
    timestamps:true,
}
)
const messageModel=mongoose.model("Message",messageSchema);
export default messageModel