import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avsthar from "../../assets/undraw_pic_profile_re_7g2h.svg"
import { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { unReadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLastMessage } from "../../hooks/userFetchLastMessage.js";
import moment from 'moment'
const UserChat = ({ chat, user }) => {
  const { recipientUser, error } = useFetchRecipientUser(chat, user);
  const {onlineUsers,notifications,markThisUserNotificationsAsRead,setIsOpen,isOpen}=useContext(ChatContext);
  const {latestMessage}=useFetchLastMessage(chat);

  
  const unreadNotifications=unReadNotificationsFunc(notifications)

  
  const truncateText=(text)=>{
    let shortText=text.substring(0,20);
    if(text.length>20){
      shortText=shortText + "..."
    }
    console.log(shortText);
    
    return shortText
  }
    
 const isOnline=onlineUsers?.some((user)=>user?.userId===recipientUser?._id)
 const thisUserNotification=unreadNotifications?.filter((n)=>{
  return n.senderId==recipientUser?._id
 })
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!recipientUser) {
    return <div>Loading...</div>;
  }
   
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-start p-2 justify-content-between"
    role="button"
    onClick={()=>{
      if(thisUserNotification?.length!==0 ){
       
        
        markThisUserNotificationsAsRead(thisUserNotification,notifications);
        
       
      }
    }}
    >
      <div className="d-flex">
        <div className="me-2"><img src={avsthar} height={"35px"} /></div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text"> {
            latestMessage?.text&&(
              <span>{truncateText(latestMessage?.text)}</span>
            )
            } </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div className={thisUserNotification?.length>0?"this-user-notifications":""}>
          {thisUserNotification?.length>0?thisUserNotification?.length:""}
        </div>
        <span className={isOnline? "user-online":""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;












