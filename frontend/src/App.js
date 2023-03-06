import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LoadingProvider from "./context/LoadingContext";
import RiseLoader from "react-spinners/RiseLoader";

function App() {
  const { isLoading } = useContext(LoadingProvider);

  return (
    <div>
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
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
