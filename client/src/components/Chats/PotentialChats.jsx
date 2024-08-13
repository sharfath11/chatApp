import { useContext } from "react"
import { ChatContext } from "../../Context/ChatContext"
import { AuthContext } from "../../Context/AuthContext";


const PotentialChats = () => {
    const{potentialChats,createChat,onlineUsers}=useContext(ChatContext)
    const {user}=useContext(AuthContext)
    
    
  return (
    <div className="all-users" >
      {potentialChats&& potentialChats.map((u,index)=>{
        // console.log(user._id,u._id);
        
        return(
            <div className="single-user" key={index} onClick={() => {
              createChat(user._id, u._id);
             
            }}>
            {u.name}
            <span className={onlineUsers?.some((user)=>user?.userId===u._id)?"user-online":""}></span>
        </div>
        )
      })}
    </div>
  )
}

export default PotentialChats




