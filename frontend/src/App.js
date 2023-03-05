import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LoadingProvider from "./context/LoadingContext";
import Loading from "./assets/loading.gif";

function App() {
  const { isLoading, setIsLoading } = useContext(LoadingProvider);

  return (
    <div>
      {isLoading ? (
        setTimeout(() => {
          setIsLoading(false);
        }, 2000)
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
