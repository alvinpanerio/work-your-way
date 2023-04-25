import SideBar from "../components/SideBar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSearch, FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import axios from "axios";

function Chat({ socket }) {
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [uid, setUid] = useState("");
  const [searchFriendsForGC, setSearchFriendsForGC] = useState("");
  const [message, setMessage] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [reload, setReload] = useState(false);
  const [isGetFriends, setIsGetFriend] = useState(true);
  const [reloadOnlineFriends, setReloadOnlineFriends] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [friendsArr, setFriendsArr] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [addedFriendsToGC, setAddedFriendsToGC] = useState([]);
  const [messages, setMessages] = useState([]);

  const { groupChatID } = useParams();
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
    if (uid) {
      getChats();
    }
  }, [uid, reload]);

  useEffect(() => {
    if (groupChatID) {
      const checkGroupChat = async () => {
        axios
          .post(process.env.REACT_APP_API_URI + "/chat/check-gc", {
            groupChatID,
            uid: uid.slice(1, 12),
          })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            navigate("/error");
          });
      };
      checkGroupChat();
    }
  }, [groupChatID, uid]);

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
          setName(result.data.accountDetails.profileDetails[0].name);
          setProfileAvatar(
            result.data.accountDetails.profileDetails[0].profileAvatar
          );
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

  const handleCreateGroupChat = async (e) => {
    e.preventDefault();
    try {
      if (addedFriendsToGC.length < 1) {
        setMessage("Add more user to the group chat!");
      } else {
        axios.post(process.env.REACT_APP_API_URI + "/chat/create-gc", {
          email,
          name,
          uid,
          profileAvatar,
          groupChatName,
          addedFriendsToGC,
        });
        setSearchFriendsForGC("");
        setGroupChatName("");
        setAddedFriendsToGC([]);
        setOpenModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getChats = async () => {
    try {
      axios
        .get(
          process.env.REACT_APP_API_URI + "/chat/get-chats/" + uid.slice(1, 12)
        )
        .then((result) => {
          setMessages([...messages, result.data.chats]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="2xl:pt-56 md:pt-48 bg-blue-100 w-full h-screen">
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/50 z-40 ${
          openModal ? "visible" : "hidden"
        }`}
      >
        <div
          className="bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8 flex flex-col 
        justify-center items-center"
        >
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-5">
            <p className="text-2xl">Create Group Chat</p>
            <button
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          <form
            onSubmit={handleCreateGroupChat}
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              className="border rounded-lg border-slate-300 p-3 focus:outline-blue-500 w-[600px]"
              placeholder="Group Chat Name"
              required
              value={groupChatName}
              onChange={(e) => {
                setGroupChatName(e.target.value);
              }}
            />
            <p className="font-semibold text-blue-500">
              Add friends to group chat
            </p>
            <div className="relative">
              <input
                type="text"
                className="rounded-lg border border-slate-300 p-3 focus:outline-blue-500 w-8/12"
                placeholder="Search friend's name..."
                value={searchFriendsForGC}
                onChange={(e) => {
                  setSearchFriendsForGC(e.target.value);
                  setMessage("");
                }}
              />
              {/* {console.log(friendsArr)} */}
              {searchFriendsForGC.trim() ? (
                <div
                  className={`w-8/12 bg-white rounded-lg px-3 absolute pt-3 mt-1 shadow-2xl overflow-auto ${
                    friendsArr > 3 ? "h-[210px]" : "h-max"
                  }`}
                >
                  {friendsArr[0]
                    ?.filter((i) => {
                      return users?.map((j, k) => {
                        // console.log(j?.email, i?.email);
                        if (j?.email === i?.email) {
                          // console.log(j?.email, i?.email);
                          if (
                            j?.profileDetails[0]?.name
                              .toLowerCase()
                              .includes(searchFriendsForGC)
                          ) {
                            return i;
                          }
                        }
                      });
                    })
                    .map((user, i) => {
                      return users?.map((j, k) => {
                        if (user?.email === j?.email) {
                          return (
                            <button
                              key={i}
                              className="flex flex-wrap items-center justify-between gap-5 w-full mb-3 hover:bg-gray-200 px-2 py-3 rounded-lg transition duration-100"
                              onClick={(e) => {
                                e.preventDefault();
                                let data = [
                                  {
                                    name: j?.profileDetails[0]?.name,
                                    email: j?.email,
                                    uid: j?.profileDetails[0]?.uid,
                                    profileAvatar:
                                      j?.profileDetails[0]?.profileAvatar,
                                  },
                                ];
                                let found = addedFriendsToGC.some((i) => {
                                  return i[0]?.email === data[0].email;
                                });
                                if (!found) {
                                  setAddedFriendsToGC([
                                    ...addedFriendsToGC,
                                    data,
                                  ]);
                                } else {
                                  setMessage("User already added!");
                                }
                                setSearchFriendsForGC("");
                              }}
                            >
                              <div className="flex flex-wrap items-center gap-5">
                                <img
                                  src={j?.profileDetails[0]?.profileAvatar}
                                  alt=""
                                  className="w-[30px] h-[30px]"
                                />
                                <div className="flex items-start flex-col">
                                  <p className="font-semibold">
                                    {j?.profileDetails[0]?.name}
                                    <span className="font-normal text-xs text-gray-400">
                                      {"  " + j?.profileDetails[0]?.uid}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        }
                      });
                    })}
                </div>
              ) : null}
            </div>
            {message ? (
              <p className="text-center text-red-500 font-semibold">
                {message}
              </p>
            ) : null}
            <div className="flex gap-3 flex-wrap">
              {addedFriendsToGC.map((i, k) => {
                return (
                  <div
                    className="bg-blue-500 rounded flex gap-3 items-center p-2"
                    key={k}
                  >
                    <p className="text-white">{i[0]?.name}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        addedFriendsToGC.splice(k, 1);
                      }}
                    >
                      <MdClose className="text-white mt-1" />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              className="bg-blue-500 font-medium rounded-lg
             px-5 py-2.5 text-center gap-2 text-md transition duration-200 text-white hover:bg-blue-700 text-center"
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
      </div>
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
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Create Group Chat
              <FaPlus className="ml-2" />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <div>
            <div className="bg-white rounded-lg px-3 pt-5 pb-3 mb-3 mt-8 shadow-md w-[370px]">
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
            <div className="bg-white rounded-lg px-3 pt-5 mb-3 shadow-md w-[370px]">
              <p className="text-2xl font-bold text-blue-500 pb-5 px-2">
                Messages
              </p>
              <div>
                {messages.length ? (
                  messages[0]?.map((i, k) => {
                    return (
                      <button
                        type="button"
                        key={k}
                        className="flex gap-3 mb-3 p-2 hover:bg-gray-200 w-full rounded-lg transition duration-200"
                        onClick={() => {
                          navigate("/chat/" + i?.groupChatID);
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1682336017038-de632a4ec2b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                          alt=""
                          className="w-[50px] h-[50px] rounded-full"
                        />
                        <div className="flex flex-col justify-between text-left w-[268px] h-[50px]">
                          <p className="font-semibold text-blue-500">
                            {i?.groupChatName}
                          </p>
                          <p className="text-ellipsis truncate text-gray-400 text-sm">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Nihil, amet.
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className="px-2 font-medium text-blue-500">
                    No messages found.
                  </p>
                )}
              </div>
              <div className="overflow-auto">
                <div className="flex gap-1 w-max"></div>
              </div>
            </div>
          </div>
          <div className="w-7/12 h-[500px] rounded-lg mt-8 shadow-md bg-white">
            {groupChatID ? groupChatID : <p>Select a conversation</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
