import SideBar from "../components/SideBar";
import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Chat({ socket }) {
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [reload, setReload] = useState(false);
  const [isGetFriends, setIsGetFriend] = useState(true);
  const [reloadOnlineFriends, setReloadOnlineFriends] = useState(false);
  const [friendsArr, setFriendsArr] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
      handleGetUsers();
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
      handleGetUsers();
    }
  }, [reload]);

  useEffect(() => {
    if (uid && isGetFriends) {
      const getFriends = async () => {
        await axios
          .get(
            process.env.REACT_APP_API_URI + "/get-friends/" + uid.slice(1, 12)
          )
          .then((result) => {
            setFriendsArr([...friendsArr, result.data.result.friends]);
          });
      };
      getFriends();
      setIsGetFriend(false);
    }
  }, [uid, email, friendsArr, socket, isGetFriends]);

  useEffect(() => {
    if (socket && email) {
      setTimeout(() => {
        setReloadOnlineFriends(!reloadOnlineFriends);
      }, 200);
    }
  }, [email, socket, reloadOnlineFriends]);

  useEffect(() => {
    if (socket && email) {
      socket.emit("onlineFriends", { receiver: email });
    }
  }, [reloadOnlineFriends]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineFriends", (data) => {
        setOnlineFriends([data]);
      });
    }
  }, [socket, onlineFriends]);

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/planner/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetUsers = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/get/users")
        .then((result) => {
          setUsers([...result.data]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="2xl:pt-56 md:pt-48 bg-blue-100 w-full h-screen">
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
        <SideBar />
        <div className="relative w-[1300px]">
          <input
            type="text"
            id="search"
            onChange={(e) => {
              setSearch(e.target.value.trim());
            }}
            placeholder="Search people..."
            className="bg-white text-gray-900 text-sm rounded-lg block w-4/12 px-10 py-2.5 focus:shadow-md focus:outline-none"
            autocomplete="off"
          />
          <FaSearch className="absolute left-3.5 top-3.5 opacity-20" />
        </div>
        <div>
          <div>&nbsp;</div>
          <div className="flex mt-3">
            <p className="text-blue-500 text-4xl font-bold mr-10">
              My Messages
            </p>
            <button
              className="bg-white hover:bg-blue-200 font-medium rounded-lg 
             px-5 py-2.5 text-center shadow-lg mr-5 flex items-center gap-2 text-md transition duration-200 text-blue-400 hover:text-white"
              onClick={() => {}}
            >
              Create Group Chat
              <FaPlus className="ml-2" />
            </button>
          </div>
        </div>
        <div className="max-h-[24rem] w-2/3"></div>
        <div>
          <div className="bg-white rounded-lg px-3 pt-5 pb-3 my-5 shadow-md w-[370px]">
            <p className="text-2xl font-bold text-blue-500 pb-5 px-2">
              Online now
            </p>
            <div className="overflow-auto">
              <div className="flex gap-1 w-max">
                {onlineFriends["0"]?.onlineUsers.map((i, z) => {
                  return friendsArr[0]?.map((j, h) => {
                    if (j?.email === i?.username) {
                      return users.map((k, l) => {
                        if (j?.email === k?.email) {
                          return (
                            <button className="flex gap-3 px-2 py-3 justify-start items-center  hover:bg-gray-200 rounded-lg transition duration-100">
                              <div className="relative">
                                <img
                                  src={k?.profileDetails[0]?.profileAvatar}
                                  alt=""
                                  className="w-[50px]"
                                />
                                <div className="w-[12px] h-[12px] bg-green-500 rounded-full absolute right-[1px] bottom-[1px] shadow-xl"></div>
                              </div>
                            </button>
                          );
                        }
                      });
                    }
                  });
                })}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg px-3 pt-5 pb-3 my-5 shadow-md w-[370px]">
            <p className="text-2xl font-bold text-blue-500 pb-5 px-2">
              Messages
            </p>
            <div className="overflow-auto">
              <div className="flex gap-1 w-max">{/* messages */}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
