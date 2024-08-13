
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);
 
  const recipientId = chat?.member?.find((id) => id !== user._id);



  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return;
      try {
        const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
        if (response.error) {
          setError(response);
        } else {
          setRecipientUser(response);
        }
      } catch (err) {
        setError({ message: err.message });
      }
    };
    getUser();
  }, [recipientId]);

  return { recipientUser, error };
};

