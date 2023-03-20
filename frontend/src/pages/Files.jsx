import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaSearch, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { FileUploader } from "react-drag-drop-files";

function Files() {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];

    setFile(fileObj);
    if (!fileObj) {
      setFile(null);
      return;
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5 focus:shadow-md focus:outline-none"
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
          <div className="flex">
            <button
              className=" bg-white hover:bg-blue-200 font-medium rounded-lg 
             px-5 py-2.5 text-center shadow-lg mr-5 mt-5 flex items-center gap-2 text-md transition duration-200"
              onClick={() => {
                inputRef.current.click();
              }}
            >
              Upload
              <FaPlus className="ml-2" />
            </button>
            {file ? (
              <p className="text-white bg-blue-500 px-3 py-1 text-center shadow-lg mr-5 mt-5 flex rounded-lg items-center gap-2 text-sm">
                {file.name}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Files;
