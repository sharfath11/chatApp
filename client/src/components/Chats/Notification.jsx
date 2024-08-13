import { useContext, useState } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";
import { unReadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  const [isOpens, setIsOpens] = useState(false);
  const { user } = useContext(AuthContext);
  const { notifications, userChats, allUsers,markAllNotificationsAsRead,markNotificationRead,setIsOpen } = useContext(ChatContext);
  const unReadNotifications = unReadNotificationsFunc(notifications);

  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  console.log("un", unReadNotifications);
  console.log("mn", modifiedNotifications);

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpens(!isOpens)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-left-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        </svg>
        {unReadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unReadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpens ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="mark-as-read" onClick={()=>markAllNotificationsAsRead(notifications)}>Mark all as read</div>
          </div>
          {modifiedNotifications?.length===0?<span className="notification">No notification yet...</span>:null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  onClick={() => {
                    markNotificationRead(n, userChats, user, notifications);
                    setIsOpen(true)
                    
                  }}
                >
                  <span>{`${n.senderName} send new message`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}{" "}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
