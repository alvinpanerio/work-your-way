import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../components/SideBar";
import { FaSearch, FaPlus } from "react-icons/fa";
import { GiProgression, GiCheckMark, GiPaperClip } from "react-icons/gi";
import { MdClose } from "react-icons/md";

function Planner() {
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [inProgValue, setInProgValue] = useState(17);
  const [newTaskValue, setNewTaskValue] = useState(3);
  const [completeTaskValue, setCompleteTaskValue] = useState(8);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDuration, setTaskDuration] = useState("day");
  const [taskTime, setTaskTime] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showNewAssigned, setShowNewAssigned] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const navigate = useNavigate();

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

  const handleSearch = () => {};

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/files/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    try {
      if (
        taskName.trim().length &&
        taskDesc.trim().length &&
        taskDuration.trim().length
      ) {
        await axios
          .post(process.env.REACT_APP_API_URI + "/planner", {
            uid,
            email,
            taskName,
            taskDesc,
            taskDuration,
            taskTime,
          })
          .then((result) => {
            setOpenModal(false);
            //remove input
            setTaskName("");
            setTaskDesc("");
            setTaskDuration("day");
            setTaskTime("");
            setShowMessage(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setShowMessage(!showMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowTable = (inProg, newAss, complete) => {
    setShowInProgress(inProg);
    setShowNewAssigned(newAss);
    setShowCompleted(complete);
  };

  return (
    <div className="lg:h-screen 2xl:pt-56 md:pt-48 bg-blue-100 sm:h-full">
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/50 z-40 ${
          openModal ? "visible" : "hidden"
        }`}
      >
        <div
          className="bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8 flex flex-col 
        justify-center items-center"
        >
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-5">
            <p className="text-2xl">Add Task</p>
            <button
              onClick={() => {
                setOpenModal(!openModal);
                setShowMessage(false);
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          {showMessage ? (
            <p className="mb-3 text-red-500">
              Please provide a non-empty value!
            </p>
          ) : null}
          <form onSubmit={handleSubmitTask} className="flex flex-col gap-3">
            <input
              type="text"
              className="border rounded-lg border-slate-300 p-3 focus:outline-blue-500 w-[600px]"
              placeholder="Task Name"
              value={taskName}
              required
              onChange={(e) => {
                setTaskName(e.target.value);
                setShowMessage(false);
              }}
            />
            <textarea
              type="text"
              className="border rounded-lg border-slate-300 p-3 focus:outline-blue-500 h-32"
              placeholder="Short Description..."
              style={{ resize: "none" }}
              value={taskDesc}
              required
              onChange={(e) => {
                setTaskDesc(e.target.value);
              }}
            />
            <div className="flex gap-3">
              <input
                type="radio"
                id="day"
                name="duration"
                value="day"
                className="peer/day hidden"
                onChange={(e) => {
                  setTaskDuration(e.target.value);
                }}
                checked={taskDuration === "day" ? true : false}
              />
              <label
                htmlFor="day"
                className="border p-3 border-slate-300 rounded-lg peer-checked/day:border-blue-500 peer-checked/day:bg-blue-100 cursor-pointer w-1/3"
              >
                Within the day
              </label>
              <input
                type="radio"
                id="week"
                name="duration"
                value="week"
                className="peer/week hidden"
                onChange={(e) => {
                  setTaskDuration(e.target.value);
                }}
              />
              <label
                htmlFor="week"
                className="border p-3 border-slate-300 rounded-lg peer-checked/week:border-blue-500 peer-checked/week:bg-blue-100 cursor-pointer w-1/3"
              >
                Within a week
              </label>
              <input
                type="radio"
                id="month"
                name="duration"
                value="month"
                className="peer/month hidden"
                onChange={(e) => {
                  setTaskDuration(e.target.value);
                }}
              />
              <label
                htmlFor="month"
                className="border p-3 border-slate-300 rounded-lg peer-checked/month:border-blue-500 peer-checked/month:bg-blue-100 cursor-pointer w-1/3"
              >
                Within a month
              </label>
            </div>
            <input
              type="time"
              onChange={(e) => {
                setTaskTime(e.target.value);
              }}
              required
            />
            <button
              className="bg-blue-500 font-medium rounded-lg
             px-5 py-2.5 text-center gap-2 text-md transition duration-200 text-white hover:bg-blue-700 text-center"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px] ">
        <SideBar />
        <div className="relative">
          <input
            type="text"
            id="seacrh"
            placeholder="Search task name..."
            className="bg-white text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5 focus:shadow-md focus:outline-none"
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3.5 top-3.5 opacity-20" />
        </div>
        <div>
          <div>&nbsp;</div>
          <div className="flex mt-3">
            <p className="text-blue-500 text-4xl font-bold mr-10">My Tasks</p>
            <button
              className="bg-white hover:bg-blue-200 font-medium rounded-lg 
             px-5 py-2.5 text-center shadow-lg mr-5 flex items-center gap-2 text-md transition duration-200 text-blue-400 hover:text-white"
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              Add Task
              <FaPlus className="ml-2" />
            </button>
          </div>
        </div>
        <div className="flex gap-5 my-3">
          <div
            className="rounded-2xl p-5 my-5 shadow-xl w-max text-white"
            style={{
              backgroundImage: "linear-gradient(to left top, #3a7bd5, #00d2ff)",
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-5 justify-center items-center">
                <div className="bg-white/30 rounded-lg p-2 h-max">
                  <GiProgression size={28} />
                </div>
                <div className="font-semibold">
                  <p>Tasks</p>
                  <p>In Progress</p>
                </div>
                <p className="font-bold text-3xl">{inProgValue}</p>
              </div>
            </div>
          </div>
          <div
            className="rounded-2xl p-5 my-5 shadow-xl w-max text-white"
            style={{
              backgroundImage: "linear-gradient(to left top, #FF8008, #FFC837)",
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-5 justify-center items-center">
                <div className="bg-white/30 rounded-lg p-2 h-max font-extrabold">
                  <GiPaperClip size={28} />
                </div>
                <div className="font-semibold">
                  <p>Tasks</p>
                  <p>New Assigned</p>
                </div>
                <p className="font-bold text-3xl">{newTaskValue}</p>
              </div>
            </div>
          </div>
          <div
            className="rounded-2xl p-5 my-5 shadow-xl w-max text-white"
            style={{
              backgroundImage: "linear-gradient(to left top, #1cd8d2, #93edc7)",
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-5 justify-center items-center">
                <div className="bg-white/30 rounded-lg p-2 h-max">
                  <GiCheckMark size={28} />
                </div>
                <div className="font-semibold">
                  <p>Tasks</p>
                  <p>Completed</p>
                </div>
                <p className="font-bold text-3xl">{completeTaskValue}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-blue-500 gap-5 items-center">
          <p className="font-semibold">Browse Tasks</p>
        </div>
        <div className="flex gap-10 bg-blue-200 rounded-lg pt-3 px-10 mt-5 mb-5 w-max">
          <input
            type="radio"
            id="inProgress"
            name="choices"
            value="inProgress"
            className="peer/inProgress hidden"
            onChange={() => {
              handleShowTable(true, false, false);
            }}
            defaultChecked
          />
          <label
            htmlFor="inProgress"
            className="border-blue-500 peer-checked/inProgress:border-b-8 peer-checked/inProgress:font-bold cursor-pointer w-[120px] pb-5 text-center"
          >
            In progress
          </label>
          <input
            type="radio"
            id="newAssigned"
            name="choices"
            value="newAssigned"
            className="peer/newAssigned hidden"
            onChange={() => {
              handleShowTable(false, true, false);
            }}
          />
          <label
            htmlFor="newAssigned"
            className="border-blue-500 peer-checked/newAssigned:border-b-8 peer-checked/newAssigned:font-bold cursor-pointer w-[120px] pb-5 text-center"
          >
            New assigned
          </label>
          <input
            type="radio"
            id="completed"
            name="choices"
            value="completed"
            className="peer/completed hidden"
            onChange={() => {
              handleShowTable(false, false, true);
            }}
          />
          <label
            htmlFor="completed"
            className="border-blue-500 peer-checked/completed:border-b-8 peer-checked/completed:font-bold cursor-pointer w-[120px] pb-5 text-center"
          >
            Completed
          </label>
        </div>
        {showInProgress ? <div>inprog</div> : null}
        {showNewAssigned ? <div>newassigned</div> : null}
        {showCompleted ? <div>completed</div> : null}
      </div>
    </div>
  );
}

export default Planner;
