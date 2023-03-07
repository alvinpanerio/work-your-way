import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import Error404 from "./pages/Error404";
import LoadingProvider from "./context/LoadingContext";
import RiseLoader from "react-spinners/RiseLoader";

function App() {
  const { isLoading } = useContext(LoadingProvider);

  return (
    <div className="select-none">
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <RiseLoader color="#3b82f6" margin={2} size={30} />
        </div>
      ) : (
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/forgot/:resetToken" element={<PasswordReset />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
