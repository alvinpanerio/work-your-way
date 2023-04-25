import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import Error404 from "./pages/Error404";
import Profile from "./pages/Profile";
import Files from "./pages/Files";
import Planner from "./pages/Planner";
import User from "./pages/User";
import LoadingProvider from "./context/LoadingContext";
import RiseLoader from "react-spinners/RiseLoader";
import io from "socket.io-client";
import Chat from "./pages/Chat";

function App() {
  const { isLoading } = useContext(LoadingProvider);
  const [socket, setSocket] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    setSocket(io(process.env.REACT_APP_API_URI));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", email);
  }, [socket, email]);

  return (
    <div className="select-none">
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <RiseLoader color="#3b82f6" margin={2} size={30} />
        </div>
      ) : (
        <BrowserRouter>
          <NavBar socket={socket} />
          <Routes>
            <Route path="/" element={<Home socket={socket} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/forgot/:resetToken" element={<PasswordReset />} />
            <Route path="*" element={<Error404 />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/files" element={<Files />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/user/:id" element={<User socket={socket} />} />
            <Route path="/chat" element={<Chat socket={socket} />} />
            <Route
              path="/chat/:groupChatID"
              element={<Chat socket={socket} />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
