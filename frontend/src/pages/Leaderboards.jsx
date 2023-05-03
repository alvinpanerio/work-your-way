import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useScreenshot } from "use-screenshot-hook";
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

  const navigate = useNavigate();

  const divRef = useRef(null);

  const { image, takeScreenshot } = useScreenshot({ ref: divRef });

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
      console.log(image);
      link.download = email + ".png";
      link.href = image;
      link.click();
    }, 200);
  };
  return (
    <div className="lg:h-screen 2xl:pt-56 md:pt-48 bg-blue-100 sm:h-full">
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px] ">
        <SideBar />
        <div className="relative w-[1300px]">
          <input
            type="text"
            id="search"
            placeholder="Search files..."
            className="bg-white text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5 focus:shadow-md focus:outline-none"
          />
          <FaSearch className="absolute left-3.5 top-3.5 opacity-20" />
        </div>
        <div>
          <div>&nbsp;</div>
          <div className="flex mt-3">
            <p className="text-blue-500 text-4xl font-bold mr-10">
              Leaderboards
            </p>
          </div>
          <div className="mt-10 w-full flex gap-3">
            <div
              ref={divRef}
              className="flex justify-between w-2/3 bg-white p-5 rounded-lg shadow-md"
            >
              <div className="flex gap-5">
                <div className="relative w-[150px] h-[150px]">
                  <img src={border} alt="" className="absolute w-[150px]" />
                  <img
                    src={pic}
                    alt=""
                    className="w-[70px] h-[70px] absolute right-10 top-10"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-blue-500 text-2xl font-bold">{name}</p>
                    <p className="font-medium text-gray-500">{uid}</p>
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
              <button className="rounded-lg bg-blue-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center h-max">
                <FaShare className="text-white" />
                Share
              </button>
            </div>
            <div className="flex gap-5 w-1/3 bg-white p-5 rounded-lg shadow-md">
              <p className="text-blue-500 font-bold text-2xl">
                Monthly Wrap-Up Countdown
              </p>
            </div>
          </div>
          <div className="w-full bg-white rounded-lg shadow-md mt-3 px-10 py-5">
            <div className="flex justify-between">
              <p className="text-blue-500 text-2xl font-bold mb-7">
                My Friends
              </p>
              <button
                className="rounded-lg bg-blue-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center h-max"
                onClick={capture}
              >
                <FaCamera />
              </button>
            </div>
            <div className="flex flex-col gap-3 max-h-[328px] overflow-auto">
              {friendsInLb
                ?.sort((a, b) => b?.points - a?.points)
                ?.map((i, z) => {
                  if (z === 0) {
                    return (
                      <div className="flex justify-center gap-10" key={z}>
                        <img
                          src="https://cdn3d.iconscout.com/3d/premium/thumb/trophy-number-one-8616537-6815626.png"
                          alt=""
                          className="h-[70px]"
                        />
                        <div className="rounded-full bg-blue-100 w-2/5 flex items-center justify-between pr-10">
                          <div className="flex gap-5 items-center">
                            <img
                              src={i?.profileAvatar}
                              className="w-[70px] h-[70px]"
                              alt=""
                            />

                            <div className="flex flex-col gap-2">
                              <p className="text-blue-500 font-bold">
                                {i?.name}
                              </p>
                              <p className="text-sm text-gray-500">{i?.uid}</p>
                            </div>
                          </div>
                          <div className="flex gap-5 items-center">
                            <p className="text-green-500 font-bold">
                              {i?.taskNum} accomplished tasks
                            </p>
                            <p className="text-blue-500 text-2xl font-bold">
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
                          className="h-[70px]"
                        />
                        <div className="rounded-full bg-blue-100 w-2/5 flex items-center justify-between pr-10">
                          <div className="flex gap-5 items-center">
                            <img
                              src={i?.profileAvatar}
                              className="w-[70px] h-[70px]"
                              alt=""
                            />
                            <div className="flex flex-col gap-2">
                              <p className="text-blue-500 font-bold">
                                {i?.name}
                              </p>
                              <p className="text-sm text-gray-500"> {i?.uid}</p>
                            </div>
                          </div>
                          <div className="flex gap-5 items-center">
                            <p className="text-green-500 font-bold">
                              {i?.taskNum} accomplished tasks
                            </p>
                            <p className="text-blue-500 text-2xl font-bold">
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
                          className="h-[70px]"
                        />
                        <div className="rounded-full bg-blue-100 w-2/5 flex items-center justify-between pr-10">
                          <div className="flex gap-5 items-center">
                            <img
                              src={i?.profileAvatar}
                              className="w-[70px] h-[70px]"
                              alt=""
                            />
                            <div className="flex flex-col gap-2">
                              <p className="text-blue-500 font-bold">
                                {i?.name}
                              </p>
                              <p className="text-sm text-gray-500"> {i?.uid}</p>
                            </div>
                          </div>
                          <div className="flex gap-5 items-center">
                            <p className="text-green-500 font-bold">
                              {i?.taskNum} accomplished tasks
                            </p>
                            <p className="text-blue-500 text-2xl font-bold">
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
                        <p className="text-blue-500 font-bold text-2xl w-[70px] flex justify-center">
                          {z + 1}
                        </p>
                        <div className="rounded-full bg-blue-100 w-2/5 flex items-center justify-between pr-10">
                          <div className="flex gap-5 items-center">
                            <img
                              src={i?.profileAvatar}
                              className="w-[70px] h-[70px]"
                              alt=""
                            />
                            <div className="flex flex-col gap-2">
                              <p className="text-blue-500 font-bold">
                                {i?.name}
                              </p>
                              <p className="text-sm text-gray-500"> {i?.uid}</p>
                            </div>
                          </div>
                          <div className="flex gap-5 items-center">
                            <p className="text-green-500 font-bold">
                              {i?.taskNum} accomplished tasks
                            </p>
                            <p className="text-blue-500 text-2xl font-bold">
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
