import { createServer } from "http";

import { Server } from "socket.io";

let onlineUsers = [];
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:5173/",
  // cors:"http://10.0.12.13:5173"
});

io.on("connection", (socket) => {
  console.log("connection", socket.id);
  //listen connction
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("online Users", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
  //add message
  socket.on("sendMessage", (message) => {
  
  
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (user) {
      //private message
      
      io.to(user.socketId).emit("getMessage", message);
      
      io.to(user.socketId).emit("getNotification", {
        senderId:message.senderId,
        isRead:false,
        senderName:message.senderName,
        date:new Date()
      });
    }
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

httpServer.listen(3000);
