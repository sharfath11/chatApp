// App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import { AuthContext } from "./Context/AuthContext";
import { useContext } from "react";
import { ChatContextProvider } from "./Context/ChatContext";
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <ChatContextProvider user={user}>
        <NavBar />
        < >
          <Routes>
            <Route path="/" element={user ? <Chat /> : <Login />} />
            <Route path="/register" element={user ? <Chat /> : <Register />} />
            <Route path="/login" element={user ? <Chat /> : <Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      </ChatContextProvider>
    </>
  );
}

export default App;
