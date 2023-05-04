import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useScreenshot } from "use-screenshot-hook";
import moment from "moment";
import { FaPlus, FaSearch, FaShare, FaCamera } from "react-icons/fa";
import SideBar from "../components/SideBar";
import Borders from "../assets/borders/Borders";

function Leaderboards() {
  const [reload, setReload] = useState(false);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [border, setBorder] = useState("");
  const [plannerList, setPlannerList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [leaderboardsList, setLeaderboardsList] = useState([]);
  const [friendsInLb, setFriendsInLb] = useState([]);
  const [points, setPoints] = useState(0);
  const [top, setTop] = useState(0);
  const [taskNum, setTaskNum] = useState(0);
  const [isPlanner, setIsPlanner] = useState(true);
  const [isFriendsInLB, setIsFriendsInLB] = useState(true);
  const [isCountdown, setIsCountdown] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const divRef = useRef(null);

  const { image, takeScreenshot } = useScreenshot({ ref: divRef });

  useEffect(() => {
    calculateCountdown();
    const intervalId = setInterval(() => {
      calculateCountdown();
    }, 60000);
    setIsCountdown(!isCountdown);
    return () => clearInterval(intervalId);
  }, [countdown, isCountdown]);

  useEffect(() => {
    setPoints(0);
    setTaskNum(0);
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
      getPlanner(JSON.parse(isAuth).email);
      getLeaderboards();
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
      getPlanner(JSON.parse(isAuth).email);
      getLeaderboards();
    }
  }, [reload]);

  useEffect(() => {
    if (plannerList.length > 0 && isPlanner) {
      getPoints();
    }
  }, [plannerList, isPlanner]);

  useEffect(() => {
    if (taskNum && points) {
      const update = async () => {
        await axios
          .post(
            process.env.REACT_APP_API_URI +
              "/leaderboards/update-points/" +
              email,
            {
              email,
              uid,
              name,
              points,
              taskNum,
              pic,
            }
          )
          .then((result) => {
            setIsPlanner(false);
            console.log(result);
          })
          .catch((err) => {
            setIsPlanner(false);
            console.log(err);
          });
        setIsPlanner(false);
      };
      update();
      setIsPlanner(false);
    }
  }, [email, points, taskNum, uid]);

  useEffect(() => {
    if (leaderboardsList.length > 0 && friends.length > 0 && isFriendsInLB) {
      getFriendsInLb();
      setIsFriendsInLB(false);
    }
  }, [leaderboardsList, friends, isFriendsInLB]);

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/files/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
          setName(result.data.accountDetails.profileDetails[0].name);
          setPic(result.data.accountDetails.profileDetails[0].profileAvatar);
          setBorder(result.data.accountDetails.profileDetails[0].border);
          setFriends([...result.data.accountDetails.friends]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getPlanner = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/planner/" + user)
        .then((result) => {
          setPlannerList([...result.data.plannerDetails.plannerList]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getPoints = async () => {
    plannerList.map((i) => {
      if (new Date() > new Date(i?.taskDuration)) {
        setTaskNum((prevPoints) => prevPoints + 1);
        setPoints((prevPoints) => prevPoints + i?.taskDurationNum);
      }
    });
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
            friends.forEach((j) => {
              if (i?.email === j?.email) {
                setFriendsInLb((prev) => [...prev, i]);
              }
            });
          }
        });
    }
  };

  const capture = () => {
    takeScreenshot();
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = email + ".png";
      link.href = image;
      link.click();
    }, 300);
  };

  const calculateCountdown = () => {
    const today = moment();
    const endOfMonth = moment().endOf("month");
    setDate(new Date(endOfMonth._d).toDateString());
    const diff = endOfMonth.diff(today);
    const duration = moment.duration(diff);
    const days = Math.round(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    setCountdown(
      `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
    );
  };

  return (
    <div className="lg:h-screen 2xl:pt-56 md:pt-48 bg-blue-100 sm:h-full">
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px] ">
        <SideBar />
        <div>
          <div>&nbsp;</div>
          <div className="flex mt-3">
            <p className="text-blue-500 text-2xl 2xl:text-4xl font-bold mr-10">
              Leaderboards
            </p>
          </div>
          <div className="2xl:mt-10 mt-5 w-full flex gap-3">
            <div
              ref={divRef}
              className="flex justify-between w-2/3 bg-white p-5 rounded-lg shadow-md h-max"
            >
              <div className="flex gap-5">
                <div className="relative 2xl:w-[150px] 2xl:h-[150px] w-[120px] h-[120px]">
                  <img src={border} alt="" className="absolute w-[150px]" />
                  <img
                    src={pic}
                    alt=""
                    className="2xl:w-[70px] 2xl:h-[70px] w-[60px] h-[60px] absolute 2xl:right-10 2xl:top-10 right-[1.875rem] top-[1.875rem]"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-blue-500 2xl:text-2xl text-xl font-bold">
                      {name}
                    </p>
                    <p className="font-medium text-gray-500 2xl:text-base text-sm">
                      {uid}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <p className="font-bold text-lg text-blue-500 w-max">
                      Top {top}
                    </p>
                    <p className="text-gray-300">•</p>
                    <p className="font-bold text-lg text-blue-500 w-max">
                      {points > 1 ? (
                        <p>{points} points</p>
                      ) : (
                        <p>{points} point</p>
                      )}
                    </p>
                    <p className="text-gray-300">•</p>
                    <p className="font-bold text-lg text-green-500 w-max">
                      {taskNum > 1 ? (
                        <p>{taskNum} accomplished tasks</p>
                      ) : (
                        <p>{taskNum} accomplished task</p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {/* <button className="rounded-lg bg-blue-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center h-max">
                <FaShare className="text-white" />
                Share
              </button> */}
            </div>
            <div className="2xl:gap-5 gap-4 w-1/3 bg-white p-5 rounded-lg shadow-md flex flex-col justify-between">
              <p className="text-blue-500 font-bold 2xl:text-2xl text-xl">
                Monthly Reset Countdown:
              </p>
              <div>
                <p className="text-red-500 2xl:text-2xl text-xl font-semibold">
                  {date}
                </p>
                <p className="text-red-500 2xl:text-lg text-base font-semibold">
                  {countdown} Remaining
                </p>
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-lg shadow-md mt-3 px-10 py-5">
            <div className="flex justify-between">
              <p className="text-blue-500 text-xl 2xl:text-2xl font-bold 2xl:mb-7 mb-5">
                My Friends
              </p>
              <button
                className="rounded-lg bg-blue-500 shadow-lg 2xl:py-3 2xl:px-5 py-2 px-4 text-white flex gap-3 items-center h-max"
                onClick={capture}
              >
                <FaCamera />
              </button>
            </div>
            <div className="flex flex-col gap-3 2xl:max-h-[328px] max-h-[208px] overflow-auto">
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
                        <div className="rounded-full bg-blue-100 w-[485px] flex items-center justify-between pr-10">
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
                  } else if (z === 1) {
                    return (
                      <div className="flex justify-center gap-10" key={z}>
                        <img
                          src="https://cdn3d.iconscout.com/3d/premium/thumb/silver-medal-8616546-6815635.png"
                          alt=""
                          className="2xl:h-[70px] h-[50px]"
                        />
                        <div className="rounded-full bg-blue-100 w-[485px] flex items-center justify-between pr-10">
                          <div className="flex gap-5 items-center">
                            <img
                              src={i?.profileAvatar}
                              className="2xl:w-[70px] 2xl:h-[70px] w-[60px] h-[60px]"
                              alt=""
                            />
                            <div className="flex flex-col gap-2">
                              <p className=" 2xl:text-base text-sm text-blue-500 font-bold">
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
                  } else if (z === 2) {
                    return (
                      <div className="flex justify-center gap-10" key={z}>
                        <img
                          src="https://cdn3d.iconscout.com/3d/premium/thumb/bronze-medal-8616543-6815632.png"
                          alt=""
                          className="2xl:h-[70px] h-[50px]"
                        />
                        <div className="rounded-full bg-blue-100 w-[485px] flex items-center justify-between pr-10">
                          <div className="flex gap-5 items-center">
                            <img
                              src={i?.profileAvatar}
                              className="2xl:w-[70px] 2xl:h-[70px] w-[60px] h-[60px]"
                              alt=""
                            />
                            <div className="flex flex-col gap-2">
                              <p className="2xl:text-base text-sm text-blue-500 font-bold">
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
                  } else {
                    return (
                      <div
                        className="flex justify-center gap-10 items-center"
                        key={z}
                      >
                        <p className="text-blue-500 font-bold text-2xl 2xl:w-[70px] w-[50px] flex justify-center">
                          {z + 1}
                        </p>
                        <div className="rounded-full bg-blue-100 w-[485px] flex items-center justify-between pr-10">
                          <div className="flex gap-5 items-center">
                            <img
                              src={i?.profileAvatar}
                              className="2xl:w-[70px] 2xl:h-[70px] w-[60px] h-[60px]"
                              alt=""
                            />
                            <div className="flex flex-col gap-2">
                              <p className="2xl:text-base text-sm text-blue-500 font-bold">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboards;
