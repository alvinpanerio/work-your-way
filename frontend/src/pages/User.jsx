import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserEdit,
  FaCheck,
  FaTimes,
  FaAngleDown,
  FaRegEdit,
  FaBookReader,
  FaLocationArrow,
  FaPhoneAlt,
  FaBirthdayCake,
  FaCircleNotch,
  FaPenAlt,
  FaUserTimes,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import SideBar from "../components/SideBar";

function User() {
  const [userInfo, SetUserInfo] = useState({});
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState({});
  const [friendsFinal, setFriendsFinal] = useState();
  const [isFriendNo, setIsFriendNo] = useState();
  const [reload, setReload] = useState(false);
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
        });
    } catch (err) {
      navigate("/error");
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
              <img
                src={userInfo.profileDetails?.[0].profileAvatar}
                alt=""
                className="w-[100px] mb-10"
              />
              {isFriendNo ? (
                isFriendNo === 1 ? (
                  <button className="h-full bg-orange-500 rounded-lg py-3 px-5 text-white flex gap-3 items-center">
                    <FaCheck />
                    Added
                  </button>
                ) : (
                  <button className="h-full bg-green-500 rounded-lg py-3 px-5 text-white flex gap-3 items-center">
                    <FaUserCheck />
                    Friend
                  </button>
                )
              ) : (
                <button
                  className="h-full bg-blue-500 rounded-lg py-3 px-5 text-white hover:bg-gray-100 hover:text-blue-500 transition duration-10 flex gap-3 items-center"
                  onClick={() => {
                    handleAddUser(userInfo.profileDetails[0].uid.slice(1, 12));
                  }}
                >
                  <FaUserPlus />
                  Add Friend
                </button>
              )}
            </div>
            <div className="flex gap-5 mb-3 items-center">
              <p className="text-blue-500 font-bold text-2xl">
                {userInfo.profileDetails?.[0].name}
              </p>
              <p className="font-medium">{userInfo.profileDetails?.[0].uid}</p>
            </div>
            <p className="mb-8 flex gap-3 items-center w-6/12">
              {userInfo.profileDetails?.[0].bio}
            </p>
            <div className="border-b-2 mb-8 w-2/12"></div>
            <p className="text-gray-400 mb-3 flex gap-3 items-center">
              <FaLocationArrow className="text-green-500" />
              {userInfo.profileDetails?.[0].address}
            </p>
            <p className="mb-3 flex gap-3 items-center">
              <FaPhoneAlt className="text-yellow-500" />
              {userInfo.profileDetails?.[0].contactNo}
            </p>
            <div className="flex gap-3 mb-3">
              <p className="flex gap-3 items-center ">
                <FaBirthdayCake className="text-red-500 " />
                {userInfo.profileDetails?.[0].bday}
              </p>
              <p className="text-gray-300">•</p>
              <p className="font-medium flex gap-3 items-center ">
                <FaBookReader className="text-blue-500" />
                {userInfo.profileDetails?.[0].course}
              </p>
              <p className="text-gray-300">•</p>
              <p className="text-gray-400 ">
                {userInfo.profileDetails?.[0].status}
              </p>
            </div>
          </div>
          <div className="w-2/3 bg-white rounded-2xl shadow-md p-10 mx-auto">
            <p className="text-blue-500 text-3xl font-bold">Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
