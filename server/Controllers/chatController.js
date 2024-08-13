import chatModel from "../Models/chatModel.js"

// create chat
const createChat=async(req,res)=>{
      
    const {firstId,secondId}=req.body
    console.log("ergfff",firstId,secondId);
    
    try {
        const chat=await chatModel.findOne({
            member:{$all:[firstId,secondId]}
        })
        if(chat)return res.status(200).json(chat);
        const newChat=new chatModel({
            member:[firstId,secondId]
        })
        const response=await newChat.save()
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error)
    }
}

//find user
const findUserChat=async(req,res)=>{
    const userId=req.params.userId
    try {
        const chats=await chatModel.find({
            member:{$in:[userId]},
        })
        res.status(200).json(chats)
       
    } catch (error) {
        res.status(500).json(error)
    }
}
//findchat
const findChat=async(req,res)=>{
    const {firstId,secondId}=req.params
    try {
        const chat=await chatModel.find({
            member:{$all:[firstId,secondId]},
        })
        res.status(200).json(chat)
       
    } catch (error) {
        res.status(500).json(error)
    }
}
export {findChat,createChat,findUserChat}
