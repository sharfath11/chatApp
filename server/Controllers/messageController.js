import messageModel from "../Models/messageModel.js";
//create message
const createMessage=async(req,res)=>{
 const {chatId,senderId,senderName,text}=req.body;
 
 
 const message=new messageModel({
     chatId,
     senderId,
     senderName,
     text,    
     createdAt: new Date()
 })
 try {
    const response= await message.save();
    res.status(200).json(response);
 } catch (error) {
    res.status(500).json(error)
 }
}
//getmessgae

const getMessage=async(req,res)=>{
    const {chatId}=req.params;
    try {
       const messgae= await messageModel.find({chatId})
       res.status(200).json(messgae);
    } catch (error) {
       res.status(500).json(error)
    }
   }
   export {createMessage,getMessage}