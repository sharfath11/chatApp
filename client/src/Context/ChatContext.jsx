import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest, getRequest } from "../utils/services.js";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendTextMessageError, setsendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setScoket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  

  // intioal socket
  useEffect(() => {
    const newScoket = io("http://localhost:3000");
    setScoket(newScoket);
    return () => {
      newScoket.disconnect();
    };
  }, [user]);
  // online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);
  // send message
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.member?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);
  //recive new message reel tyme notification
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      console.log("kikikikikikikikikiki");
      
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });
    // socket.on("getNotification", (res) => {
    //   console.log('ressssssssssssssssssssssss',res);

    //   const isChatOpen = currentChat?.member.some((id) => id === res.senderId);
    //   console.log(isChatOpen,"ishgcguygeutcdghd");

    //   if (isChatOpen) {
    //     setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
    //   } else {
    //     setNotifications((prev) => [res, ...prev]);
    //   }
    // });
    socket.on("getNotification", (res) => {
      console.log("Received notification:", res);

      // Check if the sender's ID is in the current chat's members list
      const isChatOpen = currentChat?.member?.some((id) => id === res.senderId);
      console.log("Is chat open:", res);

      // Update notifications based on whether the chat is open or not
      setNotifications((prev) => {
        if (isChatOpen&&!isOpen) {
          return [{ ...res, isRead: true }, ...prev];
        } else {
          return [res, ...prev];
        }
      });
    });
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);
  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotification = notifications.map((n) => {
      return {
        ...n,
        isRead: true,
      };
    });
    setNotifications(mNotification);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }
      const pChat = response.filter((U) => {
        let isChatCreated = false;
        if (user._id === U._id) return false;
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.member[0] === U._id || chat.member[1] === U._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChat);
      setAllUsers(response);
    };
    getUsers();
  }, [userChats,notifications]);
  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);
      setUserChatsError(null);
      if (user?._id) {
        const response = await getRequest(`${baseUrl}/chats/${user._id}`);
        setIsUserChatsLoading(false);
        if (response.error) {
          setUserChatsError(response);
        } else {
          setUserChats(response);
        }
      } else {
        setIsUserChatsLoading(false);
      }
    };

    getUserChats();

    // Clean-up function
    // return () => {
    //   setUserChats(null);
    //   setIsUserChatsLoading(false);
    //   setUserChatsError(null);
    // };
  }, [user, notifications]);
  useEffect(() => {
    const getMessegas = async () => {
      setMessagesLoading(true);
      setMessageError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setMessagesLoading(false);
      if (response.error) {
        setMessageError(response);
      } else {
        setMessages(response);
      }

      setIsUserChatsLoading(false);
    };

    getMessegas();

    // Clean-up function
    // return () => {
    //   setUserChats(null);
    //   setIsUserChatsLoading(false);
    //   setUserChatsError(null);
    // };
  }, [currentChat]);
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("you must type somthing...");
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          senderName: sender.name,
          text: textMessage,
          createdAt: new Date(),
        })
      );
      if (response.error) {
        return setsendTextMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );
  const updateCurrentChat = useCallback(
    (chat) => {
      setCurrentChat(chat);
    },
    [currentChat]
  );

  const createChat = useCallback(
    async (firstId, secondId) => {
      try {
        const response = await postRequest(
          `${baseUrl}/chats`,
          JSON.stringify({ firstId, secondId })
        );

        if (response.error) {
          console.error("Error creating chat:", response.message);
          return;
        }

        setUserChats((prev) => [...prev, response]);
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    },
    [setUserChats]
  ); // `setUserChats` is a stable function and does not need to be in dependencies
  const markNotificationRead = useCallback(
    (n, userChats, user, notifications) => {
      //find char open
      const desireadChat = userChats.find((chat) => {
        const chatMember = [user._id, n.senderId];
        const isDesireadChat = chat?.member.every((mem) => {
          
          return chatMember.includes(mem);
        });
        return isDesireadChat;
      });
      //mark notification read el =element
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });
      updateCurrentChat(desireadChat);
      setNotifications(mNotifications);
    },
    [notifications,]
  );
  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotification, notifications) => {
      //marck notification as read
      const mNotifications = notifications.map((el) => {
        let notification;
        thisUserNotification.forEach((n) => {
          if (n.senderId === el.senderId ) {
            
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });

    //  !isOpen? setNotifications(mNotifications):null
    setNotifications(mNotifications)
    }
  );
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        messageError,
        isMessagesLoading,
        sendTextMessage,
        onlineUsers,
        allUsers,
        notifications,
        markAllNotificationsAsRead,
        markNotificationRead,
        markThisUserNotificationsAsRead,
        setIsOpen,
        isOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
