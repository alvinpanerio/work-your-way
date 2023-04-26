import SideBar from "../components/SideBar";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSearch, FaPlus } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BsFillSendFill, BsPaperclip, BsFileEarmarkPost } from "react-icons/bs";

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
  const [groupChatNameDisplay, setGroupChatNameDisplay] = useState("");
  const [reload, setReload] = useState(false);
  const [isGetFriends, setIsGetFriend] = useState(true);
  const [reloadOnlineFriends, setReloadOnlineFriends] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [friendsArr, setFriendsArr] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [addedFriendsToGC, setAddedFriendsToGC] = useState([]);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [reply, setReply] = useState("");
  const [tempReply, setTempReply] = useState(null);
  const [isReplyReady, setIsReplyReady] = useState(false);
  const [selectConvo, setSelectConvo] = useState(false);
  const [button, setButton] = useState(false);
  const [isGetChat, setIsGetChat] = useState(true);
  const [file, setFile] = useState(null);

  const { groupChatID } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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
    if (socket) {
      socket.on("getMessageNotif", (data) => {
        console.log(data);
        setConversation([...conversation, data]);
        setIsGetChat(!isGetChat);
      });
    }
  }, [socket, conversation, isGetChat]);

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
      const getChats = async () => {
        try {
          await axios
            .get(
              process.env.REACT_APP_API_URI +
                "/chat/get-chats/" +
                uid.slice(1, 12)
            )
            .then((result) => {
              setMessages([result.data.chats]);
              setIsGetChat(false);
            });
        } catch (err) {
          console.log(err);
        }
      };
      getChats();
    }
  }, [uid, isGetChat]);

  useEffect(() => {
    if (groupChatID) {
      const checkGroupChat = async () => {
        axios
          .post(process.env.REACT_APP_API_URI + "/chat/check-gc", {
            groupChatID,
            uid: uid.slice(1, 12),
          })
          .then((result) => {
            setGroupChatNameDisplay(result.data.gc[0]?.groupChatName);
            setConversation(result.data.gc[0]?.conversation);
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

  useEffect(() => {
    if (isReplyReady) {
      setConversation([...conversation, tempReply]);
      setIsReplyReady(false);
    }
  }, [isReplyReady, conversation, tempReply]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectConvo]);

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
        setIsGetChat(true);
        setSearchFriendsForGC("");
        setGroupChatName("");
        setAddedFriendsToGC([]);
        setOpenModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitMyReply = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (button) {
        let data = {
          name,
          uid,
          email,
          profileAvatar,
          reply,
        };
        formData.append("n", name);
        formData.append("u", uid);
        formData.append("e", email);
        formData.append("p", profileAvatar);
        formData.append("r", reply);
        formData.append("groupChatID", groupChatID);
        axios
          .post(process.env.REACT_APP_API_URI + "/chat/send-reply", formData)
          .then((result) => {
            setReply("");
            setReload(!reload);
            console.log("dataaa", data);
            data.file = result.data.data.file;
            setConversation([...conversation, { data }]);
            setButton(false);
            setIsGetChat(!isGetChat);
            setFile(null);
            console.log(result);
            socket.emit("sendMessageNotif", {
              data,
              email,
              members: result.data.gc[0].groupMembers,
            });
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFile = async (e) => {
    const fileObj = e.target.files && e.target.files[0];
    setFile(fileObj);
    if (!fileObj) {
      setFile(null);
      return;
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
        <SideBar
          setGroupChatNameDisplay={setGroupChatNameDisplay}
          groupChatNameDisplay={groupChatNameDisplay}
        />
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
          <div className="w-[370px]">
            <div className="bg-white rounded-lg px-3 pt-5 pb-3 mb-3 mt-8 shadow-md w-full ">
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
            <div className="bg-white rounded-lg px-3 pt-5 mb-3 shadow-md w-full">
              <p className="text-2xl font-bold text-blue-500 pb-5 px-2">
                Messages
              </p>
              <div className="max-h-[390px] overflow-auto">
                {messages.length ? (
                  messages[0]?.map((i, k) => {
                    return (
                      <button
                        type="button"
                        key={k}
                        className="flex gap-3 mb-3 p-2 hover:bg-gray-200 w-full rounded-lg transition duration-200"
                        onClick={() => {
                          navigate("/chat/" + i?.groupChatID);
                          setTimeout(() => {
                            setSelectConvo(!selectConvo);
                          }, 200);
                        }}
                      >
                        <div
                          className="w-[50px] h-[50px] rounded-full text-white font-extrabold flex items-center justify-center text-3xl"
                          style={{
                            backgroundImage:
                              "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                          }}
                        >
                          {i?.groupChatName[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col justify-between text-left w-[268px] h-[50px]">
                          <p className="font-semibold text-blue-500">
                            {i?.groupChatName}
                          </p>

                          <p className="text-ellipsis truncate text-sm">
                            <span className="font-medium">
                              {messages[0].length
                                ? i?.conversation[i?.conversation.length - 1]
                                    ?.data?.name
                                  ? i?.conversation[i?.conversation?.length - 1]
                                      ?.data?.name + ": "
                                  : null
                                : i?.conversation[i?.conversation?.length - 1]
                                    ?.data?.name + ": "}
                            </span>
                            <span className="text-gray-400">
                              {
                                i?.conversation[i?.conversation?.length - 1]
                                  ?.data?.reply
                              }
                            </span>
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className="px-2 font-medium text-blue-500 pb-3">
                    No messages found.
                  </p>
                )}
              </div>
              <div className="overflow-auto">
                <div className="flex gap-1 w-max"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-8 w-6/12 h-[600px]">
            {groupChatNameDisplay ? (
              <div className="w-full h-max rounded-lg shadow-md bg-white p-5">
                <p className="text-2xl font-bold text-blue-500">
                  {groupChatNameDisplay}
                </p>
              </div>
            ) : null}
            <div className="w-full h-full rounded-lg shadow-md bg-white p-5">
              <div className="h-full">
                {groupChatID ? (
                  <div className="flex flex-col justify-between h-full overflow-auto">
                    <div className="h-full overflow-y-auto flex flex-col">
                      {conversation?.map((i, k) => {
                        return users?.map((j, l) => {
                          if (i?.data?.email === j?.email) {
                            if (i?.data?.email === email) {
                              return (
                                <div
                                  className="flex gap-5 justify-end w-full mb-5"
                                  key={l}
                                >
                                  <div className="break-words bg-blue-500 text-white w-max max-w-[250px] p-3 text-left rounded-b-2xl  mr-3  rounded-tl-2xl text-sm">
                                    {i?.data?.reply}
                                    {i?.data?.file?.originalname?.length ? (
                                      <button className="flex gap-1 justify-center items-center bg-gray-200 p-2 rounded-lg mt-2 text-black w-full">
                                        <BsFileEarmarkPost />
                                        <p className="w-full text-ellipsis truncate">
                                          {i?.data?.file?.originalname}
                                        </p>
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  className="flex gap-5 justify-start w-full mb-5"
                                  key={l}
                                >
                                  <img
                                    src={j?.profileDetails[0]?.profileAvatar}
                                    alt=""
                                    className="w-[40px] h-[40px]"
                                  />
                                  <div className="flex flex-col gap-2">
                                    <p className="font-semibold text-blue-500">
                                      {j?.profileDetails[0]?.name}
                                    </p>
                                    <div className="break-words bg-gray-200 w-max max-w-[250px] p-3 text-left rounded-b-2xl rounded-tr-2xl text-sm">
                                      {i?.data?.reply}
                                      {i?.data?.file?.originalname?.length ? (
                                        <button className="flex gap-1 justify-center items-center bg-gray-100 p-2 rounded-lg mt-2 text-black w-full">
                                          <BsFileEarmarkPost />
                                          <p className="w-full text-ellipsis truncate">
                                            {i?.data?.file?.originalname}
                                          </p>
                                        </button>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          }
                        });
                      })}
                      <div ref={bottomRef} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {file ? (
                        <div className="w-2/12 bg-gray-200 p-1 rounded-lg flex gap-1">
                          <p className="truncate text-ellipsis text-xs font-semibold">
                            {file?.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                            }}
                          >
                            <MdClose />
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <form
                      onSubmit={handleSubmitMyReply}
                      className="flex gap-3 items-center relative pt-5 w-full"
                    >
                      <input
                        style={{ display: "none" }}
                        ref={inputRef}
                        type="file"
                        onChange={handleFile}
                      />
                      <input
                        type="text"
                        className="bg-gray-100 rounded-lg px-3 py-2 focus:outline-none w-full"
                        placeholder="Aa..."
                        value={reply}
                        onChange={(e) => {
                          setReply(e.target.value);
                          if (e.target.value.trim() === "") {
                            setButton(false);
                          } else {
                            setButton(true);
                          }
                        }}
                      />

                      {button || file ? (
                        <div className="">
                          <button type="button">
                            <BsPaperclip
                              size={20}
                              className="text-blue-500 absolute right-12 top-[31px]"
                              onClick={() => {
                                inputRef.current.click();
                              }}
                            />
                          </button>
                          <button type="submit">
                            <BsFillSendFill
                              size={18}
                              className="text-blue-500 absolute right-6 top-[32px]"
                            />
                          </button>
                        </div>
                      ) : (
                        <div className="">
                          <button type="button">
                            <BsPaperclip
                              size={20}
                              className="text-blue-500 absolute right-12 top-[31px]"
                              onClick={() => {
                                inputRef.current.click();
                              }}
                            />
                          </button>
                          <BsFillSendFill
                            size={18}
                            className="text-gray-500 absolute right-6 top-[32px]"
                          />
                        </div>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center w-full h-full justify-center">
                    <p className="text-3xl font-bold text-blue-500">
                      Select a conversation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {groupChatID ? (
            <div className="w-3/12">
              <div className="flex flex-col items-center gap-3 mt-8 w-full shadow-md rounded-lg px-3 py-5 mb-3 bg-white">
                <div
                  className="w-[60px] h-[60px] rounded-full text-white font-extrabold flex items-center justify-center text-4xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                  }}
                >
                  {groupChatNameDisplay[0]?.toUpperCase()}
                </div>
                <p className="text-blue-500 font-semibold  text-xl">
                  {groupChatNameDisplay}
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-3 w-full shadow-md rounded-lg px-3 pt-5 pb-3 mb-3 bg-white">
                <div>
                  {messages[0]?.map((i, k) => {
                    if (i?.groupChatID === groupChatID) {
                      return (
                        <p
                          key={k}
                          className="text-2xl font-bold text-blue-500 pb-1 px-2"
                        >
                          {i?.groupMembers?.length + " participants"}
                        </p>
                      );
                    }
                  })}
                </div>
                <div className="w-full max-h-[192px] h-max overflow-auto">
                  {messages[0]?.map((i, k) => {
                    if (i?.groupChatID === groupChatID) {
                      return i?.groupMembers?.map((j, l) => {
                        return (
                          <button
                            type="button"
                            className="flex gap-3 hover:bg-gray-200 px-2 py-3 rounded-lg transition duration-100 w-full"
                            onClick={() => {
                              navigate("/user/" + j[0]?.uid?.slice(1, 12));
                            }}
                          >
                            <img
                              src={j[0]?.profileAvatar}
                              alt=""
                              className="w-[40px] h-[40px]"
                            />
                            <div className="flex flex-col justify-between text-left">
                              <p className="text-sm font-bold">{j[0]?.name}</p>
                              <p className="text-xs text-gray-400">
                                {j[0]?.uid}
                              </p>
                            </div>
                          </button>
                        );
                      });
                    }
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-3 w-full shadow-md rounded-lg px-3 pt-5 pb-3 mb-3 bg-white">
                <p className="text-2xl font-bold text-blue-500 pb-1 px-2">
                  Shared Files
                </p>
                <div className="w-full max-h-[168px] h-max overflow-auto">
                  {messages[0]?.map((i, k) => {
                    if (i?.groupChatID === groupChatID) {
                      return i?.conversation
                        ?.map((_, i, a) => a[a.length - 1 - i])
                        .map((j, l) => {
                          if (j?.data?.file?.originalname?.length) {
                            return (
                              <button
                                type="button"
                                className="flex gap-3 hover:bg-gray-200 px-2 py-3 rounded-lg transition duration-100 w-full items-center"
                                onClick={() => {}}
                              >
                                <BsFileEarmarkPost />
                                <div className="flex flex-col justify-between text-left">
                                  <p className="text-sm font-bold">
                                    {j?.data?.file?.originalname}
                                  </p>
                                  <p className="text-xs text-gray-400"></p>
                                </div>
                              </button>
                            );
                          }
                        });
                    }
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Chat;
