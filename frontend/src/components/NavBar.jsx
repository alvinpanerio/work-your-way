import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt, FaRegBell } from "react-icons/fa";
import { AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai";
import { MdWorkspacesFilled } from "react-icons/md";

import LoadingProvider from "../context/LoadingContext";

function NavBar({ socket }) {
  const { isLogged, setIsLogged, setIsLoading } = useContext(LoadingProvider);
  const [isNavAllowed, setisNavAllowed] = useState(false);
  const [uid, setUid] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDropDownNotif, setShowDropDownNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifTemp, setNotifTemp] = useState([]);
  const [isGet, setIsGet] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socket?.emit("newUser", email);
  }, [socket, email]);

  useEffect(() => {
    if (socket) {
      socket.on("getAddFriendNotification", (data) => {
        console.log(data);
        setNotifications((prevNotifications) => [...prevNotifications, data]);
        setNotifTemp([...notifTemp, data]);
        storeNotifications(email, uid, data);
        setIsGet(true);
      });

      socket.on("getConfirmedFriendNotification", (data) => {
        console.log(data);
        setNotifications((prevNotifications) => [...prevNotifications, data]);
        setNotifTemp([...notifTemp, data]);
        storeNotifications(email, uid, data);
        setIsGet(true);
      });
    }
  }, [notifications, socket, email, uid, notifTemp]);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).id);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isGet) {
        const getNotifications = async () => {
          try {
            await axios
              .get(
                process.env.REACT_APP_API_URI +
                  "/notifications/get-notifications/" +
                  uid.slice(1, 12)
              )
              .then((result) => {
                console.log(result.data.userNotifs.notifications);
                setNotifications([
                  ...notifications,
                  ...result.data.userNotifs.notifications,
                ]);
              });
          } catch (err) {
            console.log(err);
          }
        };
        getNotifications();
        setIsGet(false);
      }
    }, 600);
  }, [uid, isGet, notifications]);

  const storeNotifications = async (e, u, d) => {
    try {
      await axios
        .post(
          process.env.REACT_APP_API_URI + "/notifications/send-notification",
          {
            e,
            u,
            d,
          }
        )
        .then((result) => {
          console.log(result);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + `/${user}`)
        .then((result) => {
          setUid(result.data.uid);
          setAvatar(result.data.avatar);
          setEmail(result.data.email);
          setName(result.data.name);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const navbarMod = () => {
    if (window.scrollY >= 30) {
      setisNavAllowed(true);
    } else {
      setisNavAllowed(false);
    }
  };

  window.addEventListener("scroll", navbarMod);

  const logout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem("user");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav
      className={`fixed left-1/2 -translate-x-2/4 pt-12 w-screen text-[#102c54] ${
        isNavAllowed ? "shadow-md backdrop-blur-3xl z-20" : null
      }`}
    >
      <div className="container mx-auto flex justify-between">
        {isLogged ? (
          <div className="relative flex gap-7 justify-end w-full">
            <button
              className="text-center bg-white rounded-lg px-3 h-max py-3 z-50"
              type="button"
              onClick={() => {
                setShowDropDown(false);
                setShowDropDownNotif(!showDropDownNotif);
              }}
            >
              <div className="relative">
                <FaRegBell className="text-blue-500 2xl:w-[20px] 2xl:h-[20px] w-[16px] h-[16px]" />
                {notifTemp.length ? (
                  <div className="bg-red-500 rounded-full px-2 text-white absolute font-bold -top-6 left-4">
                    {notifTemp.length}
                  </div>
                ) : null}
              </div>
            </button>
            <div
              className={`z-10 ${
                showDropDownNotif ? "visible" : "hidden"
              } font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-2xl w-3/12 absolute right-[72px] top-14`}
            >
              <div className="flex flex-col items-start 2xl:gap-4 gap-2 p-3">
                <p className="2xl:text-2xl text-xl font-bold text-blue-500">
                  Notifications
                </p>
                <div className="2xl:max-h-[700px] max-h-[400px] overflow-auto">
                  {notifications.length ? (
                    notifications.map((i) => {
                      if (i[0]?.notificationType === "addFriend") {
                        return (
                          <button
                            className="flex items-center gap-5 hover:bg-gray-200 px-2 py-3 rounded-lg transition duration-100"
                            onClick={() => {
                              navigate(
                                "/user/" + i[0]?.requestor.uid.slice(1, 12)
                              );
                              setShowDropDownNotif(!showDropDownNotif);
                            }}
                          >
                            <div className="relative w-2/12">
                              <img
                                src={i[0]?.requestor.img}
                                alt=""
                                className="2xl:w-[54px] 2xl:h-[54px] 2xl:w-[40px] 2xl:h-[40px]"
                              />
                              <div
                                className="p-1 w-max rounded-full absolute 2xl:top-10 2xl:left-8 top-8 left-6"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                                }}
                              >
                                <AiOutlineUserAdd className="text-white" />
                              </div>
                            </div>
                            <div className="text-left w-10/12">
                              <p className="text-blue-500 2xl:text-base text-sm">
                                <span className="font-semibold">
                                  {i[0]?.requestor.name + " "}
                                </span>
                                added you as a friend. You can accept it now.
                              </p>
                            </div>
                          </button>
                        );
                      } else if (i[0]?.notificationType === "confirmedFriend") {
                        return (
                          <button
                            className="flex items-center gap-5 hover:bg-gray-200 px-2 py-3 rounded-lg transition duration-100"
                            onClick={() => {
                              navigate(
                                "/user/" + i[0]?.sender.uid.slice(1, 12)
                              );
                              setShowDropDownNotif(!showDropDownNotif);
                            }}
                          >
                            <div className="relative w-2/12">
                              <img
                                src={i[0]?.sender.img}
                                alt=""
                                className="2xl:w-[54px] 2xl:h-[54px] 2xl:w-[40px] 2xl:h-[40px]"
                              />
                              <div
                                className="p-1 w-max rounded-full absolute 2xl:top-10 2xl:left-8 top-8 left-6"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(to left top, #1cd8d2, #93edc7)",
                                }}
                              >
                                <AiOutlineUser className="text-white" />
                              </div>
                            </div>
                            <div className="text-left w-10/12">
                              <p className="text-blue-500 2xl:text-base text-sm">
                                <span className="font-semibold">
                                  {i[0]?.sender.name + " "}
                                </span>
                                accepted your friend request. You can now visit
                                the profile.
                              </p>
                            </div>
                          </button>
                        );
                      }
                    })
                  ) : (
                    <p className="font-semibold text-blue-500">
                      No notifications found
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowDropDown(!showDropDown);
                setShowDropDownNotif(false);
              }}
            >
              <img
                src={avatar}
                alt=""
                className="2xl:w-[48px] 2xl:h-[48px] w-[42px] h-[42px] hover:ring-blue-200 hover:ring-4 rounded-full"
              />
            </button>
            <div
              className={`z-10 ${
                showDropDown ? "visible" : "hidden"
              } font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-md w-max absolute right-0 top-14`}
            >
              <div className="flex gap-4 items-center p-5">
                <Link
                  to={"/profile"}
                  className="hover:ring-blue-200 hover:ring-4 rounded-full"
                  onClick={() => {
                    setShowDropDown(!showDropDown);
                  }}
                >
                  <img
                    src={avatar}
                    alt=""
                    className="2xl:w-[64px] 2xl:h-[64px] w-[48px] h-[48px]"
                  />
                </Link>
                <div>
                  <Link
                    to={"/profile"}
                    className="hover:underline"
                    onClick={() => {
                      setShowDropDown(!showDropDown);
                    }}
                  >
                    <p className="font-medium 2xl:text-base text-sm gap-3 text-[#102c54]">
                      {name}
                    </p>
                  </Link>
                  <p className="font-normal 2xl:text-sm text-xs text-[#102c54]">
                    {uid}
                  </p>
                  <p className="2xl:text-sm text-xs text-[#102c54]">{email}</p>
                </div>
              </div>
              <button
                className="flex flex-start items-center hover:gap-5 gap-2 duration-300 w-full px-5 py-3 font-medium 
              2xl:text-sm text-xs hover:bg-blue-500 hover:text-white hover:rounded-b-lg"
                onClick={logout}
              >
                Log Out <FaSignOutAlt />
              </button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto flex justify-between">
            <div className="flex items-center">
              <Link
                to={"/"}
                className={"font-semibold text-lg flex items-center"}
              >
                <MdWorkspacesFilled size={40} className="mr-3" /> Work Your Way
              </Link>
            </div>
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
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
