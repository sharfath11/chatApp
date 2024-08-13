import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  console.log("reginfo", registerInfo);
  console.log(user, "User");
  useEffect(() => {
    const user = localStorage.getItem("User");

    setUser(JSON.parse(user));
  }, []);
  const [loginError, setloginError] = useState(null);
  const [isLoginLoading, setLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);
  console.log("logininfo", loginInfo);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setLoginLoading(true);
      setRegisterError(true);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );
      setLoginLoading(false);
      if (response.error) {
        return setloginError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );
  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  });
  const updateRegistretionInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);
  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );
      setRegisterLoading(false);
      if (response.error) {
        console.log(response, "res");

        return setRegisterError(response);
      }
      //page refresh not login data remove
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );
  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
        registerInfo,
        updateRegistretionInfo,
        registerError,
        registerUser,
        isRegisterLoading,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
