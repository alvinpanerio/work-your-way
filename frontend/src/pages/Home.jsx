import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaLongArrowAltRight,
  FaSearch,
  FaUserPlus,
  FaCheck,
  FaUserCheck,
} from "react-icons/fa";
import { SiMicrosoftexcel, SiMicrosoftword, SiFiles } from "react-icons/si";
import { BsFiletypeExe, BsFileEarmarkImage } from "react-icons/bs";
import axios from "axios";
import LoadingProvider from "../context/LoadingContext";
import Icons from "../assets/icons/Icons";
import Arrow from "../assets/arrow-hand.svg";
import SideBar from "../components/SideBar";

function Home({ addClass, socket }) {
  const { isLogged, setIsLogged } = useContext(LoadingProvider);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [plannerList, setPlannerList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [reload, setReload] = useState(false);
  const [reloadOnlineFriends, setReloadOnlineFriends] = useState(false);
  const [isGetFriends, setIsGetFriend] = useState(true);
  const [isFriendsInLB, setIsFriendsInLB] = useState(true);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState({});
  const [friendsArr, setFriendsArr] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [leaderboardsList, setLeaderboardsList] = useState([]);
  const [friendsInLb, setFriendsInLb] = useState([]);
  const [top, setTop] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).id);
      getRecentFiles(JSON.parse(isAuth).email);
      handleGetUsers();
      getLeaderboards();
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      if (!reload) {
        getRecentFiles(JSON.parse(isAuth).email);
        getPlannerList(JSON.parse(isAuth).email);
        handleGetUsers();
        getLeaderboards();
        setReload(!reload);
      }
    }
  }, [reload]);

  useEffect(() => {
    let index = users
      .map((i) => {
        return i.profileDetails[0].uid;
      })
      .indexOf(uid);
    setFriends(users[index]);
    users.splice(index, 1);
    if (!reload) {
      setReload(!reload);
    }
  }, [users, reload, uid]);

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

  useEffect(() => {
    if (leaderboardsList.length > 0 && friendsArr.length > 0 && isFriendsInLB) {
      getFriendsInLb();
      setIsFriendsInLB(false);
    }
  }, [leaderboardsList, friends, isFriendsInLB]);

  const getRecentFiles = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/files/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);

          setFiles([...result.data.fileDetails.files]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getPlannerList = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/planner/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
          setPlannerList([...result.data.plannerDetails.plannerList]);
          setTodoList([...result.data.plannerDetails.todoList]);
        })
        .catch((err) => {
          console.log(err);
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
          setName(result.data.name);
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

  const handleVisitUser = async (id) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/user/" + id)
        .then((result) => {
          navigate("/user/" + id);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getLeaderboards = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/leaderboards/get-leaderboards")
        .then((result) => {
          setLeaderboardsList([...result?.data?.leaderboards]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getFriendsInLb = () => {
    if (leaderboardsList) {
      leaderboardsList
        .sort((a, b) => b.points - a.points)
        .forEach((i, n) => {
          if (i?.email === email) {
            setFriendsInLb((prev) => [...prev, i]);
            setTop(n + 1);
          } else {
            friendsArr.forEach((j) => {
              if (i?.email === j?.email) {
                setFriendsInLb((prev) => [...prev, i]);
              }
            });
          }
        });
    }
  };

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <>
      {isLogged ? (
        <div className="2xl:pt-56 pt-[10.5rem] bg-blue-100 w-full h-screen">
          <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
            <SideBar />
            <div className="relative w-[1300px] md:w-max">
              <input
                type="text"
                id="search"
                onChange={(e) => {
                  setSearch(e.target.value.trim());
                }}
                placeholder="Search people..."
                className="md:w-[300px] bg-white text-gray-900 text-sm rounded-lg block w-6/12 2xl:py-2.5 px-10 py-2 focus:shadow-md focus:outline-none"
                autocomplete="off"
              />
              <FaSearch className="absolute left-3.5 2xl:top-3.5 top-3 opacity-20" />

              {search.trim() ? (
                <div className="w-full bg-white rounded-lg px-3 absolute py-3 mt-1 shadow-xl">
                  <div className="2xl:h-[500px] h-[360px] overflow-auto">
                    {users.filter((i) => {
                      return search.length
                        ? i.profileDetails[0].name
                            .toLowerCase()
                            .includes(search)
                        : i;
                    }).length === 0 ? (
                      <p className="font-bold mb-3 px-2 py-3">
                        No searched results
                      </p>
                    ) : (
                      users
                        .filter((i) => {
                          return search.length
                            ? i.profileDetails[0].name
                                .toLowerCase()
                                .includes(search)
                            : i;
                        })
                        .map((user, i) => {
                          return (
                            <button
                              key={i}
                              className="w-full flex flex-wrap items-center justify-between gap-5 mb-3 hover:bg-gray-200 px-2 py-3 rounded-lg transition duration-100"
                              onClick={() => {
                                handleVisitUser(
                                  user.profileDetails[0].uid.slice(1, 12)
                                );
                              }}
                            >
                              <div className="flex flex-wrap items-center gap-5">
                                <img
                                  src={user.profileDetails[0].profileAvatar}
                                  alt=""
                                  className="2xl:w-[50px] 2xl:h-[50px] w-[40px] h-[40px]"
                                />
                                <div className="flex items-start flex-col">
                                  <p className="font-bold 2xl:text-base text-sm">
                                    {user.profileDetails[0].name}
                                  </p>
                                  <p className="2xl:text-base text-sm">
                                    {user.profileDetails[0].uid}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div>&nbsp;</div>
            <p className="text-2xl 2xl:text-4xl text-blue-500 font-bold mr-10">{`Hello, ${name}!`}</p>
            <div className="flex gap-3 w-full">
              <div className="w-8/12">
                <div className="bg-white rounded-lg 2xl:px-5 2xl:pt-5 2xl:my-5 px-4 pt-4 my-5 shadow-md">
                  <Link
                    to={"/files"}
                    className="hover:text-blue-500 flex 2xl:border-b-2 border-b-[1px] hover:gap-4 transition-all duration-100"
                  >
                    <p className="2xl:pb-5 pb-4 2xl:text-base text-sm">
                      Recent Files
                    </p>
                    <p className="2xl:pb-5 pb-4 2xl:text-base text-sm">
                      &nbsp; →
                    </p>
                  </Link>
                  <div className="flex justify-center gap-5">
                    <ul
                      className={`flex ${
                        files.length < 4 ? "justify-start" : "justify-between"
                      } w-full`}
                    >
                      {files
                        .slice(0)
                        .reverse()
                        .map((i, n) => {
                          if (n < 4) {
                            if (i.fileName.split(".").pop() === "xlsx") {
                              return (
                                <li
                                  key={n}
                                  className="flex flex-col items-center 2xl:p-8 p-4"
                                >
                                  <div className="bg-[#5cb85c] 2xl:p-3 p-2 rounded-lg">
                                    <SiMicrosoftexcel className="text-white 2xl:w-[32px] 2xl:h-[32px] w-[18px] h-[18px]" />
                                  </div>
                                  <p className="truncate w-32 mt-3 text-center 2xl:text-base text-xs">
                                    {i.fileName}
                                  </p>
                                </li>
                              );
                            } else if (
                              i.fileName.split(".").pop() === "docx" ||
                              i.fileName.split(".").pop() === "pdf"
                            ) {
                              return (
                                <li
                                  key={n}
                                  className="flex flex-col items-center 2xl:p-8 p-4"
                                >
                                  <div className="bg-[#0275d8] 2xl:p-3 p-2 rounded-lg">
                                    <SiMicrosoftword className="text-white 2xl:w-[32px] 2xl:h-[32px] w-[18px] h-[18px]" />
                                  </div>
                                  <p className="truncate w-32 mt-3 text-center 2xl:text-base text-xs">
                                    {i.fileName}
                                  </p>
                                </li>
                              );
                            } else if (i.fileName.split(".").pop() === "exe") {
                              return (
                                <li
                                  key={n}
                                  className="flex flex-col items-center 2xl:p-8 p-4"
                                >
                                  <div className="bg-[#d9534f] 2xl:p-3 p-2 rounded-lg">
                                    <BsFiletypeExe className="text-white 2xl:w-[32px] 2xl:h-[32px] w-[18px] h-[18px]" />
                                  </div>
                                  <p className="truncate w-32 mt-3 text-center 2xl:text-base text-xs">
                                    {i.fileName}
                                  </p>
                                </li>
                              );
                            } else if (
                              i.fileName.split(".").pop() === "png" ||
                              i.fileName.split(".").pop() === "jpeg" ||
                              i.fileName.split(".").pop() === "jpg"
                            ) {
                              return (
                                <li
                                  key={n}
                                  className="flex flex-col items-center 2xl:p-8 p-4"
                                >
                                  <div className="bg-[#6610f2] 2xl:p-3 p-2 rounded-lg">
                                    <BsFileEarmarkImage className="text-white 2xl:w-[32px] 2xl:h-[32px] w-[18px] h-[18px]" />
                                  </div>
                                  <p className="truncate w-32 mt-3 text-center 2xl:text-base text-xs">
                                    {i.fileName}
                                  </p>
                                </li>
                              );
                            } else {
                              return (
                                <li
                                  key={n}
                                  className="flex flex-col items-center 2xl:p-8 p-4"
                                >
                                  <div className="bg-[#292b2c] 2xl:p-3 p-2 rounded-lg">
                                    <SiFiles className="text-white 2xl:w-[32px] 2xl:h-[32px] w-[18px] h-[18px]" />
                                  </div>
                                  <p className="truncate w-32 mt-3 text-center 2xl:text-base text-xs">
                                    {i.fileName}
                                  </p>
                                </li>
                              );
                            }
                          }
                        })}
                    </ul>
                  </div>
                </div>
                <div className="max-h-[24rem] w-full">
                  {plannerList
                    .slice(0)
                    .reverse()
                    .map((i, n) => {
                      if (new Date() < new Date(i.taskDuration)) {
                        if (n < 2) {
                          return (
                            <Link to={"/planner"}>
                              <div
                                key={n}
                                className="bg-white rounded-lg 2xl:p-5 p-3 gap-5 flex items-center 2xl:mb-5 mb-3 shadow-md w-3/3 hover:bg-gray-100 transition-all duration-100"
                              >
                                <div
                                  className="2xl:w-[50px] 2xl:h-[50px] w-[40px] h-[40px] rounded-lg"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                                  }}
                                ></div>
                                <div className="flex flex-col gap-1 w-3/12">
                                  <p className="font-bold 2xl:text-base text-sm">
                                    {i.taskName}
                                  </p>
                                  <p className="text-gray-400 2xl:text-sm text-xs text-ellipsis truncate">
                                    {i.taskDescription}
                                  </p>
                                </div>
                                <div className="w-4/12">
                                  <p className="text-gray-400 2xl:text-base text-sm">
                                    {`Created: ${
                                      month[new Date(i.createdAt).getMonth()]
                                    }
                      ${new Date(i.createdAt).getDate()}, 
                      ${new Date(i.createdAt).getFullYear()}`}
                                  </p>
                                  <p className="font-bold 2xl:text-base text-sm">
                                    {`Due: ${
                                      month[new Date(i.taskDuration).getMonth()]
                                    }
                      ${new Date(i.taskDuration).getDate()}, 
                      ${new Date(i.taskDuration).getFullYear()}`}
                                  </p>
                                </div>
                                <div className="w-3/12 flex flex-col gap-3 justify-end">
                                  <div className="flex justify-between">
                                    <p className="2xl:text-sm text-xs">
                                      Remaining
                                    </p>
                                    <p className="2xl:text-sm text-xs">
                                      {i.taskDurationNum >=
                                      new Date(
                                        new Date(i.taskDuration) - new Date()
                                      ).getDate() -
                                        1
                                        ? new Date(
                                            new Date(i.taskDuration) -
                                              new Date()
                                          ).getDate() - 1
                                        : 0}
                                      d
                                    </p>
                                  </div>
                                  <div className="rounded-lg h-2 bg-[#00d2ff]/20">
                                    <div
                                      className="rounded-lg h-2"
                                      style={{
                                        backgroundImage:
                                          "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                                        width: `${
                                          (1 -
                                            (new Date(
                                              new Date(i.taskDuration) -
                                                new Date()
                                            ).getDate() -
                                              1) /
                                              i.taskDurationNum) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        }
                      } else {
                        return null;
                      }
                    })}
                </div>
                <Link to={"/leaderboards"}>
                  <div className="bg-white rounded-lg 2xl:p-5 p-3 gap-5 flex justify-center items-center 2xl:mb-5 mb-3 shadow-md w-3/3 hover:bg-gray-100 transition-all duration-100">
                    {friendsInLb
                      ?.sort((a, b) => b?.points - a?.points)
                      ?.map((i, z) => {
                        if (z === 0) {
                          return (
                            <div className="flex justify-center gap-10" key={z}>
                              <img
                                src="https://cdn3d.iconscout.com/3d/premium/thumb/trophy-number-one-8616537-6815626.png"
                                alt=""
                                className="2xl:h-[70px] h-[50px]"
                              />
                              <div className="rounded-full bg-blue-100 w-[485px] 2xl:w-[540px] flex items-center justify-between pr-10">
                                <div className="flex gap-5 items-center">
                                  <img
                                    src={i?.profileAvatar}
                                    className="2xl:w-[70px] 2xl:h-[70px] w-[60px] h-[60px]"
                                    alt=""
                                  />

                                  <div className="flex flex-col gap-2">
                                    <p className="text-blue-500 2xl:text-base text-sm font-bold">
                                      {i?.name}
                                    </p>
                                    <p className="2xl:text-sm text-xs text-gray-500">
                                      {i?.uid}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-5 items-center">
                                  <p className="2xl:text-base text-sm text-green-500 font-bold">
                                    {i?.taskNum} accomplished tasks
                                  </p>
                                  <p className="2xl:text-2xl text-xl text-blue-500 font-bold">
                                    {i?.points}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                </Link>
              </div>
              <div className="w-4/12 flex items-end flex-col gap-3 mt-5">
                <div className="bg-white rounded-lg 2xl:px-3 2xl:py-5 px-2 py-3 shadow-md w-[240px] h-max">
                  <p className="ml-1 text-blue-500 text-xl 2xl:text-2xl font-bold 2xl:mb-7 2xl:mb-5 mb-3">
                    Friends
                  </p>
                  <div className="overflow-auto h-[131px] 2xl:h-[180px]">
                    {friendsArr[0]?.map((i, j) => {
                      if (i?.isConfirmedFriend === 2) {
                        return users.map((k, l) => {
                          if (i?.email === k?.email) {
                            return (
                              <button
                                key={l}
                                type="button"
                                className="flex gap-3 justify-start px-2 py-3 items-center hover:bg-gray-200 rounded-lg transition duration-100 w-full"
                                onClick={() => {
                                  navigate(
                                    "/user/" +
                                      k?.profileDetails[0]?.uid.slice(1, 12)
                                  );
                                }}
                              >
                                <img
                                  src={k?.profileDetails[0]?.profileAvatar}
                                  alt=""
                                  className="w-[40px] h-[40px]"
                                />
                                <div className="flex flex-col justify-between items-start">
                                  <p className="text-sm font-bold">
                                    {k?.profileDetails[0]?.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {k?.profileDetails[0]?.uid}
                                  </p>
                                </div>
                              </button>
                            );
                          }
                        });
                      }
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg 2xl:px-3 2xl:py-5 px-2 py-3 shadow-md w-[240px] h-max">
                  <p className="ml-1 text-blue-500 text-xl 2xl:text-2xl font-bold 2xl:mb-7 2xl:mb-5 mb-3">
                    Online
                  </p>
                  <div>
                    <div className="overflow-auto h-[131px] 2xl:h-[180px]">
                      {onlineFriends["0"]?.onlineUsers.map((i, z) => {
                        return friendsArr[0]?.map((j, h) => {
                          if (j?.email === i?.username) {
                            return users.map((k, l) => {
                              if (j?.email === k?.email) {
                                return (
                                  <div className="flex gap-3 pb-5 justify-start px-2 items-center">
                                    <div className="relative">
                                      <img
                                        src={
                                          k?.profileDetails[0]?.profileAvatar
                                        }
                                        alt=""
                                        className="w-[40px] h-[40px]"
                                      />
                                      <div className="w-[12px] h-[12px] bg-green-500 rounded-full absolute right-[1px] bottom-[1px] shadow-xl"></div>
                                    </div>
                                    <div className="flex flex-col justify-between">
                                      <p className="text-sm font-bold">
                                        {k?.profileDetails[0]?.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {k?.profileDetails[0]?.uid}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                            });
                          }
                        });
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="2xl:pt-56 pt-[10.5rem]">
          <div className="container flex flex-col mx-auto font-roboto px-20">
            <div className="pr-20 flex justify-between flex-wrap">
              <div>
                <p className="font-semibold 2xl:text-6xl text-5xl w-[38rem] text-[#102c54]">
                  Work
                  <br />
                  Your Way
                  <br />
                  <p className="relative mt-5">
                    <div className="absolute bg-[#102c54] py-5 2xl:w-[645px] w-[525px] 2xl:h-[88px] h-[80px] -rotate-1 -top-3 2xl:-right-1 -left-5"></div>
                    <p className="text-white absolute">Personal Workspace</p>
                  </p>
                </p>
                <p className="font-base text-gray-600 2xl:text-lg text-base mt-[7.5rem]">
                  Organize, Create, and Thrive in Your Haven. Be productive as
                  always!
                </p>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg 
            text-sm 2xl:px-5 px-3 2xl:py-2.5 py-2 text-center drop-shadow-xl shadow-blue-300 mr-5 mt-5 flex items-center"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Get Started
                  <FaLongArrowAltRight className="ml-3"></FaLongArrowAltRight>
                </button>
              </div>
              <div
                className={`relative ${
                  addClass ? addClass : null
                } md:-mr-[70px]`}
              >
                <img
                  src={Arrow}
                  alt=""
                  className="absolute 2xl:-top-4 -top-7 2xl:-left-64 -left-52 2xl:w-[100px] w-[70px] rotate-12"
                />
                <p className="text-[#102c54] absolute 2xl:-left-52 -left-44 2xl:-top-1 -top-6 font-medium 2xl:text-xl text-base -rotate-2">
                  Features
                </p>
                <div className="relative 2xl:w-[200px] w-[150px] 2xl:h-[200px] h-[150px] bg-blue-500 rounded-3xl mr-20 -ml-[50px] shadow-2xl shadow-sky-500/50">
                  <img
                    src={Icons[1]}
                    alt=""
                    className="absolute 2xl:w-[170px] w-[130px] 2xl:-top-14 -top-12 2xl:left-20 left-16 z-10"
                  />
                  <p className="absolute -top-16 w-full 2xl:left-14 left-10 text-white/10 2xl:text-[250px] text-[200px]">
                    2
                  </p>
                  <p className="absolute bottom-5 left-5 w-full text-white 2xl:text-[16px] text-[12px]">
                    File Upload
                  </p>
                </div>
                <div className="relative 2xl:w-[200px] w-[150px] 2xl:h-[200px] h-[150px] bg-blue-500 rounded-3xl 2xl:-ml-[300px] -ml-[240px] shadow-2xl shadow-sky-500/50 -mt-[100px]">
                  <img
                    src={Icons[0]}
                    alt=""
                    className="2xl:w-[170px] w-[130px] absolute 2xl:-top-12 -top-10 2xl:-left-10 -left-8 z-10"
                  />
                  <p className="absolute -top-8 w-full 2xl:left-20 left-14 text-white/10 2xl:text-[250px] text-[200px]">
                    1
                  </p>
                  <p className="absolute bottom-5 left-5 w-full text-white 2xl:text-[16px] text-[12px]">
                    Chat
                  </p>
                </div>
                <div className="relative 2xl:w-[200px] w-[150px] 2xl:h-[200px] h-[150px] bg-blue-500 rounded-3xl 2xl:-ml-[200px] -ml-[160px] shadow-2xl shadow-sky-500/50 2xl:mt-[50px] mt-[40px]">
                  <img
                    src={Icons[2]}
                    alt=""
                    className="absolute 2xl:w-[170px] w-[130px] 2xl:-bottom-14 -bottom-10 2xl:right-20 right-16 z-10"
                  />
                  <p className="absolute -top-12 w-full 2xl:left-10 left-4 text-white/10 2xl:text-[250px] text-[200px]">
                    4
                  </p>
                  <p className="absolute top-5 2xl:left-20 left-14 w-full text-white 2xl:text-[16px] text-[12px]">
                    Leaderboards
                  </p>
                </div>
                <div className="relative 2xl:w-[200px] w-[150px] 2xl:h-[200px] h-[150px] bg-blue-500 rounded-3xl 2xl:ml-[50px] ml-[30px] shadow-2xl shadow-sky-500/50 2xl:-mt-[300px] -mt-[200px]">
                  <img
                    src={Icons[3]}
                    alt=""
                    className="2xl:w-[170px] w-[130px] absolute 2xl:-bottom-12 -bottom-9 2xl:-right-10 -right-8 z-10"
                  />
                  <p className="absolute 2xl:-top-16 -top-14 w-full 2xl:left-3 left-1 text-white/10 2xl:text-[250px] text-[200px]">
                    3
                  </p>
                  <p className="absolute top-5 left-5 w-full text-white 2xl:text-[16px] text-[12px]">
                    Planner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
