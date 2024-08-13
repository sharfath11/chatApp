import { useContext } from "react";
import { ChatContext } from "../Context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/Chats/UserChat";
import { AuthContext } from "../Context/AuthContext";
import PotentialChats from "../components/Chats/PotentialChats";
import ChatBox from "../components/Chats/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat, setIsOpen, isOpen } =
    useContext(ChatContext);

  return (
    <Container>
    
      {!isOpen ? (
        <>
          <PotentialChats />
          {userChats?.length > 0 && (
            <Stack direction="horizontal" gap={4} className="align-items-start">
              <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                {isUserChatsLoading && <p>Loading Chat...</p>}
                {userChats?.map((chat, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      updateCurrentChat(chat);
                      setIsOpen(true);
                    }}
                  >
                    <UserChat chat={chat} user={user} />
                  </div>
                ))}
              </Stack>
            </Stack>
          )}
        </>
      ) : (
        <ChatBox />
      )}
      </Container>
    
  );
};

export default Chat;


{/* <Container>
<PotentialChats/>
{userChats?.length < 1 ? null : (
  <Stack direction="horizontal" gap={4} className="align-items-start ">
    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
      {isUserChatsLoading && <p>Loading Chat...</p>}
      {userChats?.map((chat, index) => {
        return (
          <div key={index} onClick={() => {
            updateCurrentChat(chat);
            setIsOpen(true);
          }}>
            <UserChat chat={chat} user={user}  />
          </div>
        );
      })}
    </Stack>
   
    <ChatBox/>
  </Stack>
  
)}
</Container> */}