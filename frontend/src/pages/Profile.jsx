import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import SideBar from "../components/SideBar";
import Avatars from "../assets/avatars/Avatars";

function Profile() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [nameLeft, setNameLeft] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [image, setImage] = useState("");
  const [course, setCourse] = useState("");
  const [address, setAddress] = useState("");
  const [addressLeft, setAddressLeft] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [bday, setBday] = useState("");
  const [status, setStatus] = useState("");
  const [bio, setBio] = useState("");
  const [bioLeft, setBioLeft] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [openDeleteAccModal, setOpenDeleteAccModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const courses = [
    "Bachelor of Early Childhood Education (BECED)",
    "Bachelor of Secondary Education Major in English (BSED English)",
    "Bachelor of Secondary Education Major in Filipino (BSED Filipino)",
    "Bachelor of Secondary Education Major in Mathematics (BSED Mathematics)",
    "Bachelor of Secondary Education Major in Science (BSED Science)",
    "Bachelor of Secondary Education Major in Social Studies (BSED Social Studies)",
    "Bachelor of Science in Civil Engineering (BSCE)",
    "Bachelor of Science in Electrical Engineering (BSEE)",
    "Bachelor of Science in Information Technology (BSIT)",
    "Bachelor of Arts in Communication (BAC)",
    "Bachelor of Science in Psychology (BSP)",
    "Bachelor of Science in Social Work (BSSW)",
    "Bachelor of Science in Accountancy (BSA)",
    "Bachelor of Science in Business Administration Major in Financial Management (BSBA FM)",
    "Bachelor of Science in Business Administration Major in Human Resource Development Management (BSBA HRDM)",
    "Bachelor of Science in Business Administration Major in Marketing Management (BSBA MM)",
    "Bachelor of Science in Public Administration (BSPA)",
  ];

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
    }
  }, [cancel]);

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/files/" + user)
        .then((result) => {
          console.log(result);
          setId(result.data.accountDetails._id);
          setEmail(result.data.accountDetails.email);
          setName(result.data.accountDetails.profileDetails[0].name);
          setUid(result.data.accountDetails.profileDetails[0].uid);
          setImage(result.data.accountDetails.profileDetails[0].profileAvatar);
          setCourse(result.data.accountDetails.profileDetails[0].course);
          setAddress(result.data.accountDetails.profileDetails[0].address);
          setContactNo(result.data.accountDetails.profileDetails[0].contactNo);
          setBday(result.data.accountDetails.profileDetails[0].bday);
          setStatus(result.data.accountDetails.profileDetails[0].status);
          setBio(result.data.accountDetails.profileDetails[0].bio);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/edit-info/" + id, {
          name,
          image,
          course,
          address,
          contactNo,
          bday,
          status,
          bio,
        })
        .then((res) => {
          window.location.reload(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/delete-account/" + email, {
          password,
        })
        .then((res) => {
          window.location.reload(true);
          localStorage.removeItem("user");
        })
        .catch((err) => {
          setErrorMessage(err.response.data.errorMessage);
          setPassword("");
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="lg:h-screen 2xl:pt-56 md:pt-48 bg-blue-100 sm:h-full">
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/50 z-40 ${
          openImageModal ? "visible" : "hidden"
        }`}
      >
        <div
          className="bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8 flex flex-col 
        justify-center items-center w-[420px]"
        >
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-10">
            <p className="text-2xl">Change Profile Picture</p>
            <button
              onClick={() => {
                setOpenImageModal(!openImageModal);
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          <div className="flex flex-wrap gap-y-5 my-5 justify-center">
            {Avatars.map((avatar, i) => {
              return (
                <label
                  htmlFor={avatar}
                  className="checked cursor-pointer mr-5"
                  key={i}
                >
                  {i === 0 ? (
                    <input
                      type="radio"
                      name="avatars"
                      id={avatar}
                      value={avatar}
                      className="appearance-none hidden"
                      onChange={(e) => setImage(e.target.value)}
                      defaultChecked
                    />
                  ) : (
                    <input
                      type="radio"
                      name="avatars"
                      id={avatar}
                      value={avatar}
                      className="appearance-none hidden"
                      onChange={(e) => setImage(e.target.value)}
                    />
                  )}

                  <img src={avatar} alt="" className="w-14 h-14" />
                </label>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/50 z-40 ${
          openDeleteAccModal ? "visible" : "hidden"
        }`}
      >
        <div
          className="bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8 flex flex-col 
         w-[420px]"
        >
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-6">
            <p className="text-2xl text-red-500">Deleting Account</p>
            <button
              onClick={() => {
                setOpenDeleteAccModal(!openDeleteAccModal);
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          <div className="text-center mb-3">
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently deleted. Please confirm
            your typing your password and clicking "Delete Account" below.
          </div>
          <p className="text-gray-300 font-semibold mb-2">
            Type your password:
          </p>
          <form onSubmit={handleDeleteAccount}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none mb-2"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              required
            />
            <p className="text-red-500 mb-3 text-center">{errorMessage}</p>
            <button
              className="w-full rounded-lg bg-red-500 shadow-lg p-3 text-white"
              type="submit"
            >
              Delete Account
            </button>
          </form>
        </div>
      </div>
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
        <SideBar />
        <div className="flex mt-3 mb-10">
          <p className="text-blue-500 text-4xl font-bold mr-10">Profile</p>
        </div>
        {isEdit ? (
          <form
            className="w-2/3 bg-white rounded-2xl shadow-md p-10 mx-auto"
            onSubmit={handleUpdateInfo}
          >
            <div className="flex justify-between">
              <div className="flex gap-10">
                <div className="relative">
                  <img src={image} alt="" className="w-[100px] h-[100px]" />
                  <div className="absolute right-0 top-0">
                    <button
                      className="rounded-full bg-blue-500 text-white p-2 shadow-lg"
                      onClick={() => {
                        setOpenImageModal(true);
                      }}
                      type="button"
                    >
                      <FaRegEdit />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-xs text-blue-500">
                    {16 - nameLeft.length} character(s) left
                  </p>
                  <input
                    type="text"
                    placeholder={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameLeft(e.target.value);
                    }}
                    maxLength="16"
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                  />
                  <p className="">{uid}</p>
                  <p className="">{email}</p>
                </div>
              </div>
              <div className="h-full flex gap-3">
                <button
                  className="rounded-lg bg-green-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center"
                  type="submit"
                >
                  <FaCheck />
                  Update
                </button>
                <button
                  className="rounded-lg bg-red-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center"
                  onClick={() => {
                    setCancel(!cancel);
                    setNameLeft("");
                    setAddressLeft("");
                    setBioLeft("");
                    setIsEdit(false);
                  }}
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </div>
            <div className="mt-10 flex justify-between">
              <p className="text-blue-500 text-3xl font-bold">
                Personal Information
              </p>
              <div className="border-t-2 w-7/12 mt-5"></div>
            </div>
            <div className="mt-10">
              <div className="flex gap-10 mb-5">
                <div className="w-1/2">
                  <p className="font-bold text-lg">Course</p>
                  <div className="relative">
                    <select
                      className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none cursor-pointer"
                      style={{ appearance: "none" }}
                      onChange={(e) => {
                        setCourse(e.target.value);
                      }}
                    >
                      <option value={course} hidden defaultValue>
                        {course}
                      </option>
                      {courses.map((c, i) => (
                        <option value={c} key={i} className="bg-white">
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4">
                      <FaAngleDown />
                    </div>
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="flex gap-5 items-center">
                    <p className="font-bold text-lg">Address</p>
                    <p className="text-xs text-blue-500">
                      {50 - addressLeft.length} character(s) left
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder={address}
                    maxLength={50}
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setAddressLeft(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-10 mb-5">
                <div className="w-1/2">
                  <p className="font-bold text-lg">Contact Number</p>
                  <input
                    type="tel"
                    placeholder={!contactNo ? "e.g. 09510123456" : contactNo}
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                    pattern="[0]{1}[9]{1}[0-9]{9}"
                    onChange={(e) => {
                      setContactNo(e.target.value);
                    }}
                  />
                </div>
                <div className="w-1/2">
                  <p className="font-bold text-lg">Birthday</p>
                  <input
                    type="date"
                    placeholder={bday}
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                    max="2003-12-31"
                    min="2000-01-01"
                    onChange={(e) => {
                      setBday(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="mb-5 w-1/2">
                <p className="font-bold text-lg">Status</p>
                <div className="relative">
                  <select
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none cursor-pointer"
                    style={{ appearance: "none" }}
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  >
                    <option value={status} hidden defaultValue>
                      {status}
                    </option>
                    <option value="Studying" className="bg-white">
                      Studying
                    </option>
                    <option value="Working" className="bg-white">
                      Working
                    </option>
                    <option value="Relaxing" className="bg-white">
                      Relaxing
                    </option>
                  </select>
                  <div className="absolute right-4 top-4">
                    <FaAngleDown />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <div className="flex gap-5 items-center">
                  <p className="font-bold text-lg">Bio</p>
                  <p className="text-xs text-blue-500">
                    {100 - bioLeft.length} character(s) left
                  </p>
                </div>
                <textarea
                  type="text"
                  className="border rounded-lg bg-gray-200 p-3 h-32 w-full focus:outline-none"
                  placeholder={bio}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    setBio(e.target.value);
                    setBioLeft(e.target.value);
                  }}
                  maxLength={100}
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="w-2/3 bg-white rounded-2xl shadow-md p-10 mx-auto">
            <div className="flex justify-between">
              <div className="flex gap-10">
                <div>
                  <img src={image} alt="" className="w-[100px] h-[100px]" />
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-blue-500 text-2xl font-bold">{name}</p>
                  <p className="">{uid}</p>
                  <p className="">{email}</p>
                </div>
              </div>
              <div className="flex gap-3 h-full">
                <button
                  className="rounded-lg bg-blue-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <FaUserEdit />
                  Edit Info
                </button>
                <button
                  className="rounded-lg bg-red-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center"
                  onClick={() => {
                    setOpenDeleteAccModal(true);
                  }}
                >
                  <FaUserTimes />
                  Delete Account
                </button>
              </div>
            </div>
            <div className="mt-10 flex justify-between">
              <p className="text-blue-500 text-3xl font-bold">
                Personal Information
              </p>
              <div className="border-t-2 w-7/12 mt-5"></div>
            </div>
            <div className="mt-10">
              <div className="flex gap-10 mb-5">
                <div className="w-1/2">
                  <p className="font-bold text-lg flex gap-3 items-center">
                    <FaBookReader className="text-blue-500" />
                    Course
                  </p>
                  <p>{course}</p>
                </div>
                <div className="w-1/2">
                  <p className="font-bold text-lg flex gap-3 items-center">
                    <FaLocationArrow className="text-green-500" />
                    Address
                  </p>
                  <p>{address}</p>
                </div>
              </div>
              <div className="flex gap-10 mb-5">
                <div className="w-1/2">
                  <p className="font-bold text-lg flex gap-3 items-center">
                    <FaPhoneAlt className="text-yellow-500" />
                    Contact Number
                  </p>
                  <p>{contactNo}</p>
                </div>
                <div className="w-1/2">
                  <p className="font-bold text-lg flex gap-3 items-center">
                    <FaBirthdayCake className="text-red-500" />
                    Birthday
                  </p>
                  <p>{bday}</p>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-bold text-lg flex gap-3 items-center">
                  <FaCircleNotch className="text-orange-500" />
                  Status
                </p>
                <p>{status}</p>
              </div>
              <div className="mb-5">
                <p className="font-bold text-lg flex gap-3 items-center">
                  <FaPenAlt className="text-purple-500" />
                  Bio
                </p>
                <p>{bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
