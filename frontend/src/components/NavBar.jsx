import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";

import LoadingProvider from "../context/LoadingContext";
import Logo from "../assets/logo-transparent.png";

function NavBar() {
  const { isLogged, setIsLogged, setIsLoading } = useContext(LoadingProvider);
  const [isNavAllowed, setisNavAllowed] = useState(false);
  const [uid, setUid] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).id);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const getAccountDetails = async (user) => {
    try {
      await axios.get(`http://localhost:4000/${user}`).then((result) => {
        setUid(result.data.uid);
        setName(result.data.name);
        setAvatar(result.data.avatar);
        setEmail(result.data.email);
      });
    } catch (err) {
      console.log(err);
    }
  };

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
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowDropDown(!showDropDown);
              }}
            >
              <img
                src={avatar}
                alt=""
                className="w-[48px] h-[48px] hover:ring-blue-200 hover:ring-4 rounded-full "
              />
            </button>
            <div
              className={`z-10 ${
                showDropDown ? "visible" : "hidden"
              } font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-md w-max absolute right-0`}
            >
              <div className="flex gap-4 items-center p-5">
                <img src={avatar} alt="" className="w-[64px] h-[64px]" />
                <div>
                  <p className="font-medium text-base gap-3 text-[#102c54]">
                    {name}
                  </p>
                  <p className="font-normal text-sm text-[#102c54]">{uid}</p>
                  <p className="text-sm text-[#102c54]">{email}</p>
                </div>
              </div>
              <button
                className="flex flex-start items-center hover:gap-5 gap-2 duration-300 w-full px-5 py-3 font-medium 
              text-sm hover:bg-blue-500 hover:text-white hover:rounded-b-lg"
                onClick={logout}
              >
                Log Out <FaSignOutAlt />
              </button>
            </div>
          </div>
        ) : (
          <div>
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
