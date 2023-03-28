import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import {
  FaSearch,
  FaPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { FcGenericSortingAsc, FcGenericSortingDesc } from "react-icons/fc";
import { SiMicrosoftexcel, SiMicrosoftword, SiFiles } from "react-icons/si";
import { BsFiletypeExe } from "react-icons/bs";
import Icons from "../assets/icons/Icons";
import { motion } from "framer-motion";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import fileDownload from "js-file-download";
import { saveAs } from "file-saver";
import download from "downloadjs";
import LoadingProvider from "../context/LoadingContext";

function Files() {
  const [file, setFile] = useState(null);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [files, setFiles] = useState([]);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalIcon, setModalIcon] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [alphabetical, setAlphabetical] = useState(true);
  const [newest, setNewest] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { setFilesArr } = useContext(LoadingProvider);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      if (!reload) {
        getAccountDetails(JSON.parse(isAuth).email);
        setReload(!reload);
      }
    }
  }, [reload]);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
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
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
          setFiles([...result.data.fileDetails.files]);
          setFilesArr([...result.data.fileDetails.files]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendFile = async (e) => {
    e.preventDefault();

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
          setReload(!reload);
          setFile(null);
          setModalMessage("Your file has been uploaded successfully.");
          setModalIcon(Icons[5]);
          setOpenModal(!openModal);
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownloadFile = async (fileName, origFileName) => {
    try {
      await axios
        .get(
          process.env.REACT_APP_API_URI +
            "/files/download/" +
            uid.substring("1") +
            "/" +
            fileName,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          console.log(res.data);
          download(res.data, origFileName);
          setTimeout(() => {
            setModalMessage("The file has been downloaded successfully.");
            setModalIcon(Icons[5]);
            setOpenModal(!openModal);
          }, 500);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFile = async (e) => {
    e.preventDefault();
    try {
      setReload(!reload);
      setFile(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFileToDb = async (fileName, origFileName) => {
    try {
      await axios
        .delete(
          process.env.REACT_APP_API_URI +
            "/files/delete/" +
            uid.substring("1") +
            "/" +
            fileName
        )
        .then((res) => {
          setReload(!reload);
          setModalMessage("The file has been deleted successfully.");
          setModalIcon(Icons[6]);
          setOpenModal(!openModal);
          console.log("deleted");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <div className="lg:h-screen 2xl:pt-56 md:pt-48 bg-blue-100 sm:h-full">
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/50 z-40 ${
          openModal ? "visible" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-10 flex flex-col justify-center items-center">
          <div className="absolute bg-white rounded-full -top-[40px] p-3 mr-6">
            <img src={modalIcon} alt="" className="w-12" />
          </div>
          <p className="text-blue-500 font-bold text-lg">{modalMessage}</p>
          <button
            className="bg-blue-500 font-medium rounded-lg mt-5
             px-5 py-2.5 text-center mr-5 flex items-center gap-2 text-md transition duration-200 text-white hover:bg-blue-700"
            onClick={() => {
              setOpenModal(!openModal);
              setModalIcon(null);
              setModalMessage("");
            }}
          >
            OK
          </button>
        </div>
      </div>
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px] ">
        <SideBar />
        <div className="relative">
          <input
            type="text"
            id="seacrh"
            placeholder="Search files..."
            className="bg-white text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5 focus:shadow-md focus:outline-none"
            onChange={handleSearch}
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
            <p className="text-blue-500 text-4xl font-bold mr-10">My Files</p>
            <button
              className="bg-white hover:bg-blue-200 font-medium rounded-lg 
             px-5 py-2.5 text-center shadow-lg mr-5 flex items-center gap-2 text-md transition duration-200 text-blue-400 hover:text-white"
              onClick={() => {
                inputRef.current.click();
              }}
            >
              Add File
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
          <div className="bg-white rounded-lg px-5 pt-5 my-5 shadow-md">
            <p className=" border-b-2 pb-5">Recent Files</p>
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
                    if (n < 5) {
                      if (i.fileName.split(".").pop() === "xlsx") {
                        return (
                          <li
                            key={n}
                            className="flex flex-col items-center p-8"
                          >
                            <div className="bg-[#5cb85c] p-3 rounded-lg">
                              <SiMicrosoftexcel
                                size={32}
                                className="text-white"
                              />
                            </div>
                            <p className="truncate w-32 mt-3 text-center">
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
                            className="flex flex-col items-center p-8"
                          >
                            <div className="bg-[#0275d8] p-3 rounded-lg">
                              <SiMicrosoftword
                                size={32}
                                className="text-white"
                              />
                            </div>
                            <p className="truncate w-32 mt-3 text-center">
                              {i.fileName}
                            </p>
                          </li>
                        );
                      } else if (i.fileName.split(".").pop() === "exe") {
                        return (
                          <li
                            key={n}
                            className="flex flex-col items-center p-8"
                          >
                            <div className="bg-[#d9534f] p-3 rounded-lg">
                              <BsFiletypeExe size={32} className="text-white" />
                            </div>
                            <p className="truncate w-32 mt-3 text-center">
                              {i.fileName}
                            </p>
                          </li>
                        );
                      } else {
                        return (
                          <li
                            key={n}
                            className="flex flex-col items-center p-8"
                          >
                            <div className="bg-[#292b2c] p-3 rounded-lg">
                              <SiFiles size={32} className="text-white" />
                            </div>
                            <p className="truncate w-32 mt-3 text-center">
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
          <div className="flex text-blue-500 gap-5 items-center">
            <p className="font-semibold">Browse Files</p>
            <div className="flex gap-5">
              <button
                className="bg-white p-1 rounded-lg"
                onClick={() => {
                  setNewest(null);
                  if (alphabetical === true) {
                    setAlphabetical(false);
                  } else {
                    setAlphabetical(true);
                  }
                }}
              >
                {alphabetical ? (
                  <AiOutlineSortAscending size={24} />
                ) : (
                  <AiOutlineSortDescending size={24} />
                )}
              </button>
              <button
                className="bg-white p-1 rounded-lg"
                onClick={() => {
                  setAlphabetical(null);
                  if (newest === true) {
                    setNewest(false);
                  } else {
                    setNewest(true);
                  }
                }}
              >
                {newest ? (
                  <FcGenericSortingAsc size={24} />
                ) : (
                  <FcGenericSortingDesc size={24} />
                )}
              </button>
            </div>
          </div>
          <table class="table-fixed w-full">
            <thead>
              <tr className="bg-blue-200 rounded-lg py-3 px-16 mt-5 flex justify-between items-center mb-5">
                <th className="w-[200px] flex justify-start">File Name</th>
                <th className="w-[200px] flex justify-center">Date Uploaded</th>
                <th className="w-[200px] flex justify-center">File Size</th>
                <th className="w-[200px] flex justify-end">Options</th>
              </tr>
            </thead>
            <tbody className="">
              <div className="max-h-[24rem] overflow-y-scroll">
                {(() => {
                  if (alphabetical === true) {
                    return (
                      <div>
                        {files
                          .slice(0)
                          .sort((a, b) => a.fileName.localeCompare(b.fileName))
                          .filter((i) => {
                            return search.toLowerCase()
                              ? i.fileName.toLowerCase().includes(search)
                              : i;
                          })
                          .map((i, n) => {
                            if (i.fileName.split(".").pop() === "xlsx") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#5cb85c] p-1 rounded-md">
                                      <SiMicrosoftexcel className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (
                              i.fileName.split(".").pop() === "docx" ||
                              i.fileName.split(".").pop() === "pdf"
                            ) {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#0275d8] p-1 rounded-md">
                                      <SiMicrosoftword className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (i.fileName.split(".").pop() === "exe") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#d9534f] p-1 rounded-md">
                                      <BsFiletypeExe className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#292b2c] p-1 rounded-md">
                                      <SiFiles className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                      </div>
                    );
                  }

                  if (alphabetical === false) {
                    return (
                      <div>
                        {files
                          .slice(0)
                          .sort((a, b) => b.fileName.localeCompare(a.fileName))
                          .filter((i) => {
                            return search.toLowerCase()
                              ? i.fileName.toLowerCase().includes(search)
                              : i;
                          })
                          .map((i, n) => {
                            if (i.fileName.split(".").pop() === "xlsx") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#5cb85c] p-1 rounded-md">
                                      <SiMicrosoftexcel className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (
                              i.fileName.split(".").pop() === "docx" ||
                              i.fileName.split(".").pop() === "pdf"
                            ) {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#0275d8] p-1 rounded-md">
                                      <SiMicrosoftword className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (i.fileName.split(".").pop() === "exe") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#d9534f] p-1 rounded-md">
                                      <BsFiletypeExe className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#292b2c] p-1 rounded-md">
                                      <SiFiles className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                      </div>
                    );
                  }

                  if (newest === true) {
                    return (
                      <div>
                        {files
                          .slice(0)
                          .reverse()
                          .filter((i) => {
                            return search.toLowerCase()
                              ? i.fileName.toLowerCase().includes(search)
                              : i;
                          })
                          .map((i, n) => {
                            if (i.fileName.split(".").pop() === "xlsx") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#5cb85c] p-1 rounded-md">
                                      <SiMicrosoftexcel className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (
                              i.fileName.split(".").pop() === "docx" ||
                              i.fileName.split(".").pop() === "pdf"
                            ) {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#0275d8] p-1 rounded-md">
                                      <SiMicrosoftword className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (i.fileName.split(".").pop() === "exe") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#d9534f] p-1 rounded-md">
                                      <BsFiletypeExe className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#292b2c] p-1 rounded-md">
                                      <SiFiles className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                      </div>
                    );
                  }

                  if (newest === false) {
                    return (
                      <div>
                        {files
                          .slice(0)
                          .filter((i) => {
                            return search.toLowerCase()
                              ? i.fileName.toLowerCase().includes(search)
                              : i;
                          })
                          .map((i, n) => {
                            if (i.fileName.split(".").pop() === "xlsx") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#5cb85c] p-1 rounded-md">
                                      <SiMicrosoftexcel className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (
                              i.fileName.split(".").pop() === "docx" ||
                              i.fileName.split(".").pop() === "pdf"
                            ) {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#0275d8] p-1 rounded-md">
                                      <SiMicrosoftword className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (i.fileName.split(".").pop() === "exe") {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#d9534f] p-1 rounded-md">
                                      <BsFiletypeExe className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else {
                              return (
                                <tr className="bg-white rounded-lg px-16 py-4 flex justify-between items-center mb-5 shadow-md">
                                  <td className="w-[200px] flex justify-start items-center gap-3 relative">
                                    <div className="bg-[#292b2c] p-1 rounded-md">
                                      <SiFiles className="text-white" />
                                    </div>
                                    <p className="truncate pl-2">
                                      {i.fileName}
                                    </p>
                                  </td>
                                  <td className="w-[200px] flex justify-center text-center gap-1">
                                    <p className="text-blue-500 font-bold">
                                      {new Date(
                                        i.updatedAt
                                      ).toLocaleDateString() ===
                                      new Date().toLocaleDateString()
                                        ? "Today,"
                                        : `${new Date(
                                            i.updatedAt
                                          ).toLocaleDateString()},`}
                                    </p>

                                    {`${new Date(
                                      i.updatedAt
                                    ).toLocaleTimeString()}`}
                                  </td>
                                  <td className="w-[200px] flex justify-center">
                                    {i.fileSize}
                                  </td>
                                  <td className="w-[200px] flex justify-end gap-5 items-center">
                                    <button>
                                      <FaCloudDownloadAlt
                                        size={22}
                                        className="text-[#5cb85c]"
                                        onClick={() => {
                                          handleDownloadFile(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                    <button>
                                      <FaTrash
                                        size={18}
                                        className="text-[#d9534f]"
                                        onClick={() => {
                                          handleDeleteFileToDb(
                                            i.file.filename,
                                            i.fileName
                                          );
                                        }}
                                      />
                                    </button>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                      </div>
                    );
                  }
                })()}
              </div>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Files;
