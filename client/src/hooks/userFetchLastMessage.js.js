import {useContext, useEffect, useState }from 'react'
import  { ChatContext } from '../Context/ChatContext'
import { baseUrl, getRequest } from '../utils/services'
export const useFetchLastMessage=(chat)=>{
    const {newMessage,notification}=useContext(ChatContext)
 const [latestMessage,setLatestMessage]=useState(null)
 useEffect(()=>{
    const getMessages = async () => {
       
        
          const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
          if (response.error) {
            return console.log('error getting message ',response.error);
            
          } 
        const lastMessage=response[response?.length-1];
        setLatestMessage(lastMessage)
      };
      getMessages();
 },[newMessage,notification,chat]);
 return {latestMessage}
}