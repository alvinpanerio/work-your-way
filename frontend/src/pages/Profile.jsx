import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUserEdit,
  FaCheck,
  FaTimes,
  FaAngleDown,
  FaRegEdit,
} from "react-icons/fa";
import SideBar from "../components/SideBar";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [image, setImage] = useState("");
  const [course, setCourse] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [bday, setBday] = useState("");
  const [status, setStatus] = useState("");
  const [bio, setBio] = useState("");
  const [isEdit, setIsEdit] = useState(false);
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

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/files/" + user)
        .then((result) => {
          console.log(result);
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

  const handleUpdateInfo = async () => {
    console.log("update");
  };

  return (
    <div className="lg:h-screen 2xl:pt-56 md:pt-48 bg-blue-100 sm:h-full">
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
        <SideBar />
        <div className="flex mt-3 mb-10">
          <p className="text-blue-500 text-4xl font-bold mr-10">Profile</p>
        </div>
        {isEdit ? (
          <div className="w-2/3 bg-white rounded-2xl shadow-md p-10 mx-auto">
            <div className="flex justify-between">
              <div className="flex gap-10">
                <div className="relative">
                  <img src={image} alt="" className="w-[100px] h-[100px]" />
                  <div className="absolute right-0 top-0">
                    <button className="rounded-full bg-blue-500 text-white p-2 shadow-lg">
                      <FaRegEdit />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <input
                    type="text"
                    placeholder={name}
                    maxlength="16"
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                  />
                  <p className="">{uid}</p>
                  <p className="">{email}</p>
                </div>
              </div>
              <div className="h-full flex gap-3">
                <button
                  className="rounded-lg bg-green-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center"
                  onClick={handleUpdateInfo}
                >
                  <FaCheck />
                  Update
                </button>
                <button
                  className="rounded-lg bg-red-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center"
                  onClick={() => {
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
                    >
                      <option value={course} hidden selected>
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
                  <p className="font-bold text-lg">Address</p>
                  <input
                    type="text"
                    placeholder={address}
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-10 mb-5">
                <div className="w-1/2">
                  <p className="font-bold text-lg">Contact Number</p>
                  <input
                    type="tel"
                    placeholder={contactNo}
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                    pattern="[0]{1}-[9]{1}-[0-9]{9}"
                  />
                </div>
                <div className="w-1/2">
                  <p className="font-bold text-lg">Birthday</p>
                  <input
                    type="date"
                    placeholder={bday}
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="mb-5 w-1/2">
                <p className="font-bold text-lg">Status</p>
                <div className="relative">
                  <select
                    className="w-full bg-gray-200 p-3 pr-10 rounded-lg focus:outline-none cursor-pointer"
                    style={{ appearance: "none" }}
                  >
                    <option value={status} hidden selected>
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
                <p className="font-bold text-lg">Bio</p>
                <textarea
                  type="text"
                  className="border rounded-lg bg-gray-200 p-3 h-32 w-full focus:outline-none"
                  placeholder={bio}
                  style={{ resize: "none" }}
                  required
                  onChange={(e) => {}}
                />
              </div>
            </div>
          </div>
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
              <div>
                <button
                  className="rounded-lg bg-blue-500 shadow-lg py-3 px-5 text-white flex gap-3 items-center"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <FaUserEdit />
                  Edit Info
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
                  <p>{course}</p>
                </div>
                <div className="w-1/2">
                  <p className="font-bold text-lg">Address</p>
                  <p>{address}</p>
                </div>
              </div>
              <div className="flex gap-10 mb-5">
                <div className="w-1/2">
                  <p className="font-bold text-lg">Contact Number</p>
                  <p>{contactNo}</p>
                </div>
                <div className="w-1/2">
                  <p className="font-bold text-lg">Birthday</p>
                  <p>{bday}</p>
                </div>
              </div>
              <div className="mb-5">
                <p className="font-bold text-lg">Status</p>
                <p>{status}</p>
              </div>
              <div className="mb-5">
                <p className="font-bold text-lg">Bio</p>
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
