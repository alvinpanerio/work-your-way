import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight, FaSearch } from "react-icons/fa";
import axios from "axios";
import LoadingProvider from "../context/LoadingContext";
import Icons from "../assets/icons/Icons";
import Arrow from "../assets/arrow-hand.svg";
import SideBar from "../components/SideBar";

function Home({ addClass }) {
  const { isLogged, setIsLogged } = useContext(LoadingProvider);
  const [name, setName] = useState("");
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
      await axios
        .get(process.env.REACT_APP_API_URI + `/${user}`)
        .then((result) => {
          setName(result.data.name);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="2xl:pt-56 md:pt-48">
      {isLogged ? (
        <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
          <SideBar />
          <div className="relative">
            <input
              type="text"
              id="seacrh"
              placeholder="Search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5"
            />
            <FaSearch className="absolute left-3.5 top-3.5 opacity-20" />
          </div>
          <p className="text-2xl text-[#102c54] font-bold mt-12">{`Hello, ${name.toUpperCase()}!`}</p>
        </div>
      ) : (
        <div className="container flex flex-col mx-auto font-roboto px-20">
          <div className="flex justify-between flex-wrap">
            <div>
              <p className="font-semibold text-6xl w-[38rem] text-[#102c54]">
                Design
                <br />
                Your Perfect
                <br />
                <p className="relative mt-5">
                  <div className="absolute bg-[#102c54] py-5 w-[600px] h-[88px] -rotate-2 -top-3 right-5"></div>
                  <p className="text-white absolute">Personal Workspace</p>
                </p>
              </p>
              <p className="font-base text-gray-600 text-lg mt-32">
                Organize, Create, and Thrive in Your Haven. Be productive as
                always!
              </p>
              <button
                className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg 
            text-sm px-5 py-2.5 text-center drop-shadow-xl shadow-blue-300 mr-5 mt-5 flex items-center"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Get Started
                <FaLongArrowAltRight className="ml-3"></FaLongArrowAltRight>
              </button>
            </div>
            <div
              className={`relative ${addClass ? addClass : null} md:-mr-[70px]`}
            >
              <img
                src={Arrow}
                alt=""
                className="absolute -top-4 -left-64 w-[100px] rotate-12"
              />
              <p className="text-[#102c54] absolute -left-52 -top-1 font-medium text-xl -rotate-2">
                Features
              </p>
              <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl mr-20 -ml-[50px] shadow-2xl shadow-sky-500/50">
                <img
                  src={Icons[1]}
                  alt=""
                  className="absolute w-[170px] -top-14 left-20 z-10"
                />
                <p className="absolute -top-16 w-full left-14 text-white/10 text-[250px]">
                  2
                </p>
                <p className="absolute bottom-5 left-5 w-full text-white text-[16px]">
                  File Upload
                </p>
              </div>
              <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl -ml-[300px] shadow-2xl shadow-sky-500/50 -mt-[100px]">
                <img
                  src={Icons[0]}
                  alt=""
                  className="w-[170px] absolute -top-12 -left-10 z-10"
                />
                <p className="absolute -top-8 w-full left-20 text-white/10 text-[250px]">
                  1
                </p>
                <p className="absolute bottom-5 left-5 w-full text-white text-[16px]">
                  Chat
                </p>
              </div>
              <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl -ml-[200px] shadow-2xl shadow-sky-500/50 mt-[50px]">
                <img
                  src={Icons[2]}
                  alt=""
                  className="absolute w-[170px] -bottom-14 right-20 z-10"
                />
                <p className="absolute -top-12 w-full left-10 text-white/10 text-[250px]">
                  4
                </p>
                <p className="absolute top-5 left-20 w-full text-white text-[16px]">
                  Leaderboards
                </p>
              </div>
              <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl ml-[50px] shadow-2xl shadow-sky-500/50 -mt-[300px]">
                <img
                  src={Icons[3]}
                  alt=""
                  className="w-[170px] absolute -bottom-12 -right-10 z-10"
                />
                <p className="absolute -top-16 w-full left-3 text-white/10 text-[250px]">
                  3
                </p>
                <p className="absolute top-5 left-5 w-full text-white text-[16px]">
                  Planner
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
