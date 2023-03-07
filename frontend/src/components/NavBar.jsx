import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../shared/Button";
import LoadingProvider from "../context/LoadingContext";
import Logo from "../assets/logo-transparent.png";

function NavBar() {
  const { isLogged, setIsLogged, setIsLoading } = useContext(LoadingProvider);
  const [isNavAllowed, setisNavAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const navbarMod = () => {
    if (window.scrollY >= 30) {
      setisNavAllowed(true);
      console.log("hala");
    } else {
      setisNavAllowed(false);
    }
  };
  window.addEventListener("scroll", navbarMod);

  const logout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem("user");
      console.log("logout");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav
      className={`fixed left-1/2 -translate-x-2/4 py-12 w-screen text-[#102c54] ${
        isNavAllowed ? "shadow-md backdrop-blur-3xl z-20" : null
      }`}
    >
      <div className="container mx-auto flex justify-between">
        <div className="flex items-center">
          <Link to={"/"} className={"font-semibold text-lg flex items-center"}>
            <img src={Logo} alt="" className="h-[28px] mr-3" /> Personal
            Workspace
          </Link>
        </div>
        {isLogged ? (
          <Button onclick={logout} size={"base"} n={"700"} h={"800"}>
            Log Out
          </Button>
        ) : (
          <div>
            {/* <Button to={"/login"} size={"base"} n={"700"} h={"800"}>
            Log In
          </Button>
          <Button to={"/signup"} size={"base"} n={"400"} h={"500"}>
            Sign Up
          </Button> */}
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg 
            text-sm px-5 py-2.5 text-center drop-shadow-xl shadow-blue-300 mr-5"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </button>
            <button
              className="text-blue-500 bg-white hover:bg-slate-200 font-medium rounded-lg 
            text-sm px-5 py-2.5 text-center drop-shadow-xl shadow-blue-300"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
