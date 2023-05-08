import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FaCheck,
  FaBookReader,
  FaLocationArrow,
  FaPhoneAlt,
  FaBirthdayCake,
  FaUserPlus,
  FaUserCheck,
  FaCircleNotch,
  FaPenAlt,
} from "react-icons/fa";
import SideBar from "../components/SideBar";

function User({ socket }) {
  const [userInfo, SetUserInfo] = useState({});
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState({});
  const [friendsFinal, setFriendsFinal] = useState();
  const [isFriendNo, setIsFriendNo] = useState();
  const [reload, setReload] = useState(false);
  const [requestorMe, setRequestorMe] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    } else {
      handleFindingUser();
      handleGetUsers();
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
    }
  }, []);

  useEffect(() => {
    let index = users
      .map((i) => {
        return i.profileDetails[0].uid;
      })
      .indexOf(uid);
    setFriends(users[index]);
    users.splice(index, 1);
  }, [users, uid]);

  useEffect(() => {
    setFriendsFinal([friends?.friends]);
  }, [friends]);

  useEffect(() => {
    const isFriend = () => {
      friendsFinal?.[0]?.forEach((x, i) => {
        if (userInfo.email === x.email) {
          setIsFriendNo(x.isConfirmedFriend);
          setRequestorMe(x.isRequestorMe);
        }
      });
    };
    isFriend();
  }, [friendsFinal, userInfo.email]);

  useEffect(() => {
    handleGetUsers();
    let index = users
      .map((i) => {
        return i.profileDetails[0].uid;
      })
      .indexOf(uid);
    setFriends(users[index]);
    users.splice(index, 1);
    setFriendsFinal([friends?.friends]);
    const isFriend = () => {
      friendsFinal?.[0]?.forEach((x, i) => {
        if (userInfo.email === x.email) {
          setIsFriendNo(x.isConfirmedFriend);
          setRequestorMe(x.isRequestorMe);
        }
      });
    };
    isFriend();
  }, [reload]);

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

  const handleFindingUser = async () => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/find-user/" + id)
        .then((result) => {
          SetUserInfo(result.data.result);
        })
        .catch((err) => {
          navigate("/error");
        });
    } catch (err) {
      console.log(err);
    }
  };

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

  const handleAddUser = async (id) => {
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/add-friend/" + id, {
          email,
          uidRequestor: uid,
        })
        .then((result) => {
          setReload(!reload);
          console.log(result);
          socket.emit("addFriend", {
            addedFriend: {
              email: result.data.addedFriend.email,
              name: result.data.addedFriend.profileDetails?.[0].name,
              uid: result.data.addedFriend.profileDetails?.[0].uid,
              img: result.data.addedFriend.profileDetails?.[0].profileAvatar,
            },
            requestor: {
              email: result.data.requestor.email,
              name: result.data.requestor.profileDetails?.[0].name,
              uid: result.data.requestor.profileDetails?.[0].uid,
              img: result.data.requestor.profileDetails?.[0].profileAvatar,
            },
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmUser = async (id) => {
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/confirm-user/" + id, {
          email,
          confirmingUser: uid,
        })
        .then((result) => {
          setReload(!reload);
          socket.emit("confirmedFriend", {
            receiver: {
              email: result.data.secondUser.email,
              name: result.data.secondUser.profileDetails?.[0].name,
              uid: result.data.secondUser.profileDetails?.[0].uid,
              img: result.data.secondUser.profileDetails?.[0].profileAvatar,
            },
            sender: {
              email: result.data.user.email,
              name: result.data.user.profileDetails?.[0].name,
              uid: result.data.user.profileDetails?.[0].uid,
              img: result.data.user.profileDetails?.[0].profileAvatar,
            },
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="lg:h-screen 2xl:pt-56 md:pt-48 bg-blue-100 sm:h-full">
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
        <SideBar />
        <div className="mb-14"></div>
        <div className="mt-3 mb-10">
          <div className="w-2/3 bg-white rounded-2xl shadow-md p-10 mx-auto mb-5">
            <div className="flex justify-between">
              <div className="flex gap-10">
                <img
                  src={userInfo.profileDetails?.[0].profileAvatar}
                  alt=""
                  className="2xl:w-[100px] 2xl:h-[100px] w-[80px] h-[80px]"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-blue-500 2xl:text-2xl text-xl font-bold">
                    {userInfo.profileDetails?.[0].name}
                  </p>
                  <p className="2xl:text-base text-sm">
                    {userInfo.profileDetails?.[0].uid}
                  </p>
                  <p className="2xl:text-base text-sm">{userInfo.email}</p>
                </div>
              </div>
              {isFriendNo ? (
                isFriendNo === 1 ? (
                  requestorMe ? (
                    <button className="h-full bg-orange-500 rounded-lg 2xl:py-3 2xl:px-5 py-2 px-4 2xl:text-base text-xs text-white flex gap-3 items-center">
                      <FaCheck />
                      Added
                    </button>
                  ) : (
                    <button
                      className="h-full bg-green-500 rounded-lg 2xl:py-3 2xl:px-5 py-2 px-4 2xl:text-base text-xs text-white flex gap-3 items-center"
                      onClick={() => {
                        handleConfirmUser(
                          userInfo.profileDetails[0].uid.slice(1, 12)
                        );
                      }}
                    >
                      <FaCheck />
                      Confirm
                    </button>
                  )
                ) : (
                  <button className="h-full bg-green-500 rounded-lg 2xl:py-3 2xl:px-5 py-2 px-4 2xl:text-base text-xs text-white flex gap-3 items-center">
                    <FaUserCheck />
                    Friend
                  </button>
                )
              ) : (
                <button
                  className="h-full bg-blue-500 rounded-lg 2xl:py-3 2xl:px-5 py-2 px-4 2xl:text-base text-xs text-white hover:bg-gray-100 hover:text-blue-500 transition duration-10 flex gap-3 items-center"
                  onClick={() => {
                    handleAddUser(userInfo.profileDetails[0].uid.slice(1, 12));
                  }}
                >
                  <FaUserPlus />
                  Add Friend
                </button>
              )}
            </div>
            <div className="2xl:mt-10 mt-5 flex justify-between">
              <p className="text-blue-500 2xl:text-3xl text-2xl font-bold">
                Personal Information
              </p>
              <div className="border-t-2 w-7/12 2xl:mt-5 mt-4"></div>
            </div>

            <div className="2xl:mt-10 mt-5">
              <div className="flex gap-10 2xl:mb-5 mb-3">
                <div className="w-1/2">
                  <p className="font-bold 2xl:text-lg text-base flex gap-3 items-center">
                    <FaBookReader className="text-blue-500" />
                    Course
                  </p>
                  <p className="2xl:text-base text-sm">
                    {" "}
                    {userInfo.profileDetails?.[0].course}
                  </p>
                </div>
                <div className="w-1/2">
                  <p className="font-bold 2xl:text-lg text-base flex gap-3 items-center">
                    <FaLocationArrow className="text-green-500" />
                    Address
                  </p>
                  <p className="2xl:text-base text-sm break-words">
                    {userInfo.profileDetails?.[0].address}
                  </p>
                </div>
              </div>
              <div className="flex gap-10 2xl:mb-5 mb-3 ">
                <div className="w-1/2">
                  <p className="font-bold 2xl:text-lg text-base flex gap-3 items-center">
                    <FaPhoneAlt className="text-yellow-500" />
                    Contact Number
                  </p>
                  <p className="2xl:text-base text-sm">
                    {userInfo.profileDetails?.[0].contactNo}
                  </p>
                </div>
                <div className="w-1/2">
                  <p className="font-bold 2xl:text-lg text-base flex gap-3 items-center">
                    <FaBirthdayCake className="text-red-500" />
                    Birthday
                  </p>
                  <p className="2xl:text-base text-sm">
                    {userInfo.profileDetails?.[0].bday}
                  </p>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-bold 2xl:text-lg text-base flex gap-3 items-center">
                  <FaCircleNotch className="text-orange-500" />
                  Status
                </p>
                <p className="2xl:text-base text-sm">
                  {userInfo.profileDetails?.[0].status}
                </p>
              </div>
              <div className="mb-5">
                <p className="font-bold 2xl:text-lg text-base flex gap-3 items-center">
                  <FaPenAlt className="text-purple-500" />
                  Bio
                </p>
                <p className="2xl:text-base text-sm break-words">
                  {userInfo.profileDetails?.[0].bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
