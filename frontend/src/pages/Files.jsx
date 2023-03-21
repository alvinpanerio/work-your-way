import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaSearch, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

function Files() {
  const [file, setFile] = useState(null);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).id);
    } else {
    }
  }, []);

  const handleFileChange = (e) => {
    const fileObj = e.target.files && e.target.files[0];
    setFile(fileObj);
    if (!fileObj) {
      setFile(null);
      return;
    }
  };

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/files/" + user)
        .then((result) => {
          setUid(result.data.uid);
          setEmail(result.data.email);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendFile = async (e) => {
    e.preventDefault();
    console.log();
    try {
      const formData = new FormData();
      formData.append("file", inputRef.current.files[0]);
      formData.append("fileName", inputRef.current.files[0].name);
      formData.append("fileSize", inputRef.current.files[0].size);
      formData.append("uid", uid);
      formData.append("email", email);
      await axios
        .post(process.env.REACT_APP_API_URI + "/files", formData)
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFile = async (e) => {
    e.preventDefault();
    try {
      setFile(null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="2xl:pt-56 md:pt-48 bg-blue-100">
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px] ">
        <SideBar />
        <div className="relative">
          <input
            type="text"
            id="seacrh"
            placeholder="Search"
            className="bg-white text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5 focus:shadow-md focus:outline-none"
          />
          <FaSearch className="absolute left-3.5 top-3.5 opacity-20" />
        </div>
        <div>
          <div>&nbsp;</div>
          <input
            style={{ display: "none" }}
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
          />
          <div className="flex mt-3">
            <button
              className=" bg-white hover:bg-blue-200 font-medium rounded-lg 
             px-5 py-2.5 text-center shadow-lg mr-5 flex items-center gap-2 text-md transition duration-200"
              onClick={() => {
                inputRef.current.click();
              }}
            >
              Upload
              <FaPlus className="ml-2" />
            </button>
            {file ? (
              <div className="flex items-center gap-4">
                <p className="text-white bg-blue-500 px-3 py-2 text-center shadow-lg flex rounded-lg items-center gap-3 text-sm">
                  {file.name}
                </p>
                <button
                  className="bg-white p-1 rounded-md"
                  onClick={handleSendFile}
                >
                  <FaCheck className="text-[#5cb85c]" />
                </button>
                <button
                  className="bg-white p-1 rounded-md"
                  onClick={handleDeleteFile}
                >
                  <FaTimes className="text-[#d9534f]" />
                </button>
              </div>
            ) : null}
          </div>
          <div className="bg-white rounded-lg p-5 my-10">
            <p className=" border-b-2 pb-5">Recent Files</p>
            <div className="flex justify-center gap-5">
              <ul>
                <li>{}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Files;
