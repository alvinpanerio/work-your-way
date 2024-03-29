import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTimer } from "react-timer-hook";
import SideBar from "../components/SideBar";
import { FaSearch, FaPlus } from "react-icons/fa";
import { GiProgression, GiCheckMark, GiPaperClip } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { GoKebabVertical } from "react-icons/go";
import { TbDiscountCheckFilled, TbDiscountCheck } from "react-icons/tb";
import { CgToday } from "react-icons/cg";
import { CiPlay1, CiRedo, CiPause1 } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

function Planner() {
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [inProgValue, setInProgValue] = useState(0);
  const [newTaskValue, setNewTaskValue] = useState(0);
  const [completeTaskValue, setCompleteTaskValue] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDuration, setTaskDuration] = useState("day");
  const [taskDurationNum, setTaskDurationNum] = useState(0);
  const [taskTime, setTaskTime] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showNewAssigned, setShowNewAssigned] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [plannerList, setPlannerList] = useState([]);
  const [search, setSearch] = useState("");
  const [expiryTimestamp, setExpiryTimestamp] = useState(
    new Date().setSeconds(new Date().getSeconds() + 1500)
  );
  const [timerDuration, setTimerDuration] = useState("pomodoro");
  const [timerPause, setTimerPause] = useState(false);
  const [timerState, setTimerState] = useState();
  const [openModalTodo, setOpenModalTodo] = useState(false);
  const [todoDesc, setTodoDesc] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openTaskNewModal, setOpenTaskNewModal] = useState(false);
  const [openTaskCompleteModal, setOpenTaskCompleteModal] = useState(false);
  const [modalTaskName, setModalTaskName] = useState("");
  const [modalTaskDesc, setModalTaskDesc] = useState("");
  const [modalTaskDue, setModalTaskDue] = useState("");
  const [modalTaskCreated, setModalTaskCreated] = useState("");
  const [modalTaskTime, setModalTaskTime] = useState("");
  const [modalTaskRemaining, setModalTaskRemaining] = useState("");
  const [modalId, setModalId] = useState("");
  const [reload, setReload] = useState(false);

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => console.warn("onExpire called"),
  });

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).email);
    }
  }, [reload]);

  useEffect(() => {
    setInProgValue(getInProgLength());
    setNewTaskValue(getNewLength());
    setCompleteTaskValue(getCompletedLength());
  }, [plannerList]);

  const getInProgLength = () => {
    let count = 0;
    plannerList.forEach((i) => {
      if (new Date() < new Date(i.taskDuration)) {
        count++;
      }
    });
    return count;
  };

  const getNewLength = () => {
    let count = 0;
    plannerList.forEach((i) => {
      let now = `${
        month[new Date().getMonth()]
      } ${new Date().getDate()}, ${new Date().getFullYear()}`;
      let created = `${month[new Date(i.createdAt).getMonth()]} ${new Date(
        i.createdAt
      ).getDate()}, ${new Date(i.createdAt).getFullYear()}`;

      if (now === created) {
        count++;
      }
    });
    return count;
  };

  const getCompletedLength = () => {
    let count = 0;
    plannerList.map((i) => {
      if (new Date() > new Date(i.taskDuration)) {
        count++;
      }
    });
    return count;
  };

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/planner/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
          setPlannerList([...result.data.plannerDetails.plannerList]);
          setTodoList([...result.data.plannerDetails.todoList]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      console.log(plannerList);
      console.log(inProgValue);
      if (
        taskName.trim().length &&
        taskDesc.trim().length &&
        taskDuration.trim().length
      ) {
        await axios
          .post(process.env.REACT_APP_API_URI + "/planner", {
            uid,
            email,
            taskName: taskName.charAt(0).toUpperCase() + taskName.slice(1),
            taskDesc,
            taskDurationNum,
            taskDuration,
            taskTime,
          })
          .then((result) => {
            setReload(!reload);
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

  const handleSubmitTodo = async (e) => {
    e.preventDefault();
    try {
      if (todoDesc.trim().length) {
        await axios
          .post(process.env.REACT_APP_API_URI + "/planner/todo", {
            uid,
            email,
            todoDesc,
            markDone: false,
          })
          .then((result) => {
            setReload(!reload);
            setOpenModalTodo(false);
            setTodoDesc("");
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

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setSearch(e.target.value);
  };

  const changeTimer = (duration, durationText) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + duration);

    restart(time);
    pause();
    setTimerDuration(durationText);
  };

  const handleMarkTodoDone = async (e, markDone, id) => {
    e.preventDefault();
    try {
      await axios
        .put(process.env.REACT_APP_API_URI + "/planner/todo/" + id, {
          uid,
          email,
          markDone,
        })
        .then((result) => {
          setReload(!reload);
          setOpenModalTodo(false);
          setTodoDesc("");
          setShowMessage(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTodo = async (e, id) => {
    e.preventDefault();
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/planner/todo/" + id, {
          uid,
          email,
        })
        .then((result) => {
          setReload(!reload);
          setOpenModalTodo(false);
          setTodoDesc("");
          setShowMessage(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTask = async (e, id) => {
    e.preventDefault();
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/planner/task/" + id, {
          uid,
          email,
        })
        .then((result) => {
          setReload(!reload);
          setOpenTaskModal(false);
          setOpenTaskNewModal(false);
          setOpenTaskCompleteModal(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkDoneTask = async (e, id) => {
    e.preventDefault();
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/planner/task-done/" + id, {
          uid,
          email,
        })
        .then((result) => {
          setReload(!reload);
          setOpenTaskModal(false);
          setOpenTaskNewModal(false);
          setOpenTaskCompleteModal(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
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
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/50 z-40 ${
          openModalTodo ? "visible" : "hidden"
        }`}
      >
        <div
          className="bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8 flex flex-col 
        justify-center items-center"
        >
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-5">
            <p className="text-2xl">Add Todo</p>
            <button
              onClick={() => {
                setOpenModalTodo(!openModalTodo);
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
          <form onSubmit={handleSubmitTodo} className="flex flex-col gap-3">
            <textarea
              type="text"
              className="border rounded-lg border-slate-300 p-3 focus:outline-blue-500 h-32 w-96"
              placeholder="Todo Description..."
              style={{ resize: "none" }}
              value={todoDesc}
              required
              onChange={(e) => {
                setTodoDesc(e.target.value);
              }}
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
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/20 z-40 ${
          openTaskModal ? "visible" : "hidden"
        }`}
      >
        <div className="w-[600px] bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8">
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-5">
            <p className="text-2xl">{modalTaskName}</p>
            <button
              onClick={() => {
                setOpenTaskModal(!openTaskModal);
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          <div className="flex gap-5 items-center mb-5">
            <div
              className="w-[20px] h-[20px] rounded-lg"
              style={{
                backgroundImage:
                  "linear-gradient(to left top, #3a7bd5, #00d2ff)",
              }}
            ></div>
            <p>In Progress</p>
          </div>
          <p className="text-gray-400 mb-5 break-all">{modalTaskDesc}</p>
          <p className="">
            {`Created: ${month[new Date(modalTaskCreated).getMonth()]}
                      ${new Date(modalTaskCreated).getDate()}, 
                      ${new Date(modalTaskCreated).getFullYear()}`}
          </p>
          <p className="font-bold text-red-500 mb-5">
            {`Due: ${month[new Date(modalTaskDue).getMonth()]}
                      ${new Date(modalTaskDue).getDate()}, 
                      ${new Date(modalTaskDue).getFullYear()}
                      ${
                        Number(modalTaskTime.slice(0, 2)) >= 12
                          ? Number(modalTaskTime.slice(0, 2)) === 12
                            ? modalTaskTime + " P.M."
                            : (
                                Number(modalTaskTime.slice(0, 2)) - 12
                              ).toString().length === 1
                            ? `0${
                                Number(modalTaskTime.slice(0, 2)) - 12
                              }:${modalTaskTime.slice(3, 5)} P.M.`
                            : Number(modalTaskTime.slice(0, 2)) -
                              12 +
                              Number(modalTaskTime.slice(3, 5)) +
                              " P.M."
                          : modalTaskTime + " A.M."
                      }`}
          </p>
          <div className="flex justify-between mb-3">
            <p className="text-sm">Remaining</p>
            <p className="text-sm">
              {modalTaskRemaining >=
              new Date(new Date(modalTaskDue) - new Date()).getDate() - 1
                ? new Date(new Date(modalTaskDue) - new Date()).getDate() - 1
                : 0}
              d
            </p>
          </div>
          <div className="rounded-lg h-2 bg-[#00d2ff]/20 mb-5">
            <div
              className="rounded-lg h-2"
              style={{
                backgroundImage:
                  "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                width: `${
                  (1 -
                    (new Date(new Date(modalTaskDue) - new Date()).getDate() -
                      1) /
                      modalTaskRemaining) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="w-full flex justify-end gap-5">
            <button
              className="rounded-lg bg-green-500 shadow-lg p-3 text-white"
              onClick={(e) => {
                handleMarkDoneTask(e, modalId);
              }}
            >
              Done
            </button>
            <button
              className="rounded-lg bg-red-500 shadow-lg p-3 text-white"
              onClick={(e) => {
                handleDeleteTask(e, modalId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/20 z-40 ${
          openTaskNewModal ? "visible" : "hidden"
        }`}
      >
        <div className="w-[600px] bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8">
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-5">
            <p className="text-2xl">{modalTaskName}</p>
            <button
              onClick={() => {
                setOpenTaskNewModal(!openTaskNewModal);
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          <div className="flex gap-5 items-center mb-5">
            <div
              className="w-[20px] h-[20px] rounded-lg"
              style={{
                backgroundImage:
                  "linear-gradient(to left top, #FF8008, #FFC837)",
              }}
            ></div>
            <p>New Assigned</p>
          </div>
          <p className="text-gray-400 mb-5 break-all">{modalTaskDesc}</p>
          <p className="">
            {`Created: ${month[new Date(modalTaskCreated).getMonth()]}
                      ${new Date(modalTaskCreated).getDate()}, 
                      ${new Date(modalTaskCreated).getFullYear()}`}
          </p>
          <p className="font-bold text-red-500 mb-5">
            {`Due: ${month[new Date(modalTaskDue).getMonth()]}
                      ${new Date(modalTaskDue).getDate()}, 
                      ${new Date(modalTaskDue).getFullYear()}
                      ${
                        Number(modalTaskTime.slice(0, 2)) >= 12
                          ? Number(modalTaskTime.slice(0, 2)) === 12
                            ? modalTaskTime + " P.M."
                            : (
                                Number(modalTaskTime.slice(0, 2)) - 12
                              ).toString().length === 1
                            ? `0${
                                Number(modalTaskTime.slice(0, 2)) - 12
                              }:${modalTaskTime.slice(3, 5)} P.M.`
                            : Number(modalTaskTime.slice(0, 2)) -
                              12 +
                              Number(modalTaskTime.slice(3, 5)) +
                              " P.M."
                          : modalTaskTime + " A.M."
                      }`}
          </p>
          <div className="flex justify-between mb-3">
            <p className="text-sm">Remaining</p>
            <p className="text-sm">
              {modalTaskRemaining >=
              new Date(new Date(modalTaskDue) - new Date()).getDate() - 1
                ? new Date(new Date(modalTaskDue) - new Date()).getDate() - 1
                : 0}
              d
            </p>
          </div>
          <div className="rounded-lg h-2 bg-[#00d2ff]/20 mb-5">
            <div
              className="rounded-lg h-2"
              style={{
                backgroundImage:
                  "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                width: `${
                  (1 -
                    (new Date(new Date(modalTaskDue) - new Date()).getDate() -
                      1) /
                      modalTaskRemaining) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="w-full flex justify-end">
            <button
              className="rounded-lg bg-red-500 shadow-lg p-3 text-white"
              onClick={(e) => {
                handleDeleteTask(e, modalId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/20 z-40 ${
          openTaskCompleteModal ? "visible" : "hidden"
        }`}
      >
        <div className="w-[600px] bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8">
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-5">
            <p className="text-2xl">{modalTaskName}</p>
            <button
              onClick={() => {
                setOpenTaskCompleteModal(!openTaskCompleteModal);
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          <div className="flex gap-5 items-center mb-5">
            <div
              className="w-[20px] h-[20px] rounded-lg"
              style={{
                backgroundImage:
                  "linear-gradient(to left top, #1cd8d2, #93edc7)",
              }}
            ></div>
            <p>Completed</p>
          </div>
          <p className="text-gray-400 mb-5 break-all">{modalTaskDesc}</p>
          <p className="">
            {`Created: ${month[new Date(modalTaskCreated).getMonth()]}
                      ${new Date(modalTaskCreated).getDate()}, 
                      ${new Date(modalTaskCreated).getFullYear()}`}
          </p>
          <p className="font-bold text-green-500 mb-5">
            {`Completed on/before: ${month[new Date(modalTaskDue).getMonth()]}
                      ${new Date(modalTaskDue).getDate()}, 
                      ${new Date(modalTaskDue).getFullYear()}
                      ${
                        Number(modalTaskTime.slice(0, 2)) >= 12
                          ? Number(modalTaskTime.slice(0, 2)) === 12
                            ? modalTaskTime + " P.M."
                            : (
                                Number(modalTaskTime.slice(0, 2)) - 12
                              ).toString().length === 1
                            ? `0${
                                Number(modalTaskTime.slice(0, 2)) - 12
                              }:${modalTaskTime.slice(3, 5)} P.M.`
                            : Number(modalTaskTime.slice(0, 2)) -
                              12 +
                              Number(modalTaskTime.slice(3, 5)) +
                              " P.M."
                          : modalTaskTime + " A.M."
                      }`}
          </p>
          <div className="wfull flex flex-col gap-3 justify-end mb-5">
            <div className="flex justify-between items-center">
              <p className="text-sm">Completed</p>
              <p className="text-sm text-[#1cd8d2]">
                <TbDiscountCheckFilled size={20} />
              </p>
            </div>
            <div className="rounded-lg h-2">
              <div
                className="rounded-lg h-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to left top, #1cd8d2, #93edc7)",
                }}
              ></div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <button
              className="rounded-lg bg-red-500 shadow-lg p-3 text-white"
              onClick={(e) => {
                handleDeleteTask(e, modalId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px] ">
        <SideBar />
        <div className="relative w-[1300px] md:w-max">
          <input
            type="text"
            id="search"
            placeholder="Search task name..."
            className="md:w-[700px] bg-white text-gray-900 text-sm rounded-lg block w-6/12 2xl:py-2.5 px-10 py-2 focus:shadow-md focus:outline-none"
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3.5 2xl:top-3.5 top-3   opacity-20" />
        </div>
        <div>
          <div>&nbsp;</div>
          <div className="flex 2xl:mt-3 items-center">
            <p className="text-blue-500 font-bold mr-10 text-2xl 2xl:text-4xl">
              My Tasks
            </p>
            <button
              className="2xl:px-5 2xl:py-2.5 2xl:text-base bg-white hover:bg-blue-200 font-medium rounded-lg 
              px-4 py-2 text-sm text-center shadow-lg mr-5 flex items-center gap-2 transition duration-200 text-blue-400 hover:text-white"
              onClick={() => {
                setOpenModal(!openModal);
              }}
            >
              Add Task
              <FaPlus className="ml-2" />
            </button>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-2/3">
            <div className="flex gap-5 2xl:my-3 items-center">
              <div
                className="rounded-2xl p-5 my-5 shadow-xl w-max text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row 2xl:gap-5 gap-3 justify-center items-center">
                    <div className="bg-white/30 rounded-lg p-2 h-max">
                      <GiProgression className="2xl:w-[28px] 2xl:h-[28px] w-[20px] h-[20px]" />
                    </div>
                    <div className="font-semibold 2xl:text-base text-sm">
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
                  backgroundImage:
                    "linear-gradient(to left top, #FF8008, #FFC837)",
                }}
              >
                <div className="flex flex-col gap-3 ">
                  <div className="flex flex-row 2xl:gap-5 gap-3 justify-center items-center">
                    <div className="bg-white/30 rounded-lg p-2 h-max font-extrabold">
                      <GiPaperClip className="2xl:w-[28px] 2xl:h-[28px] w-[20px] h-[20px]" />
                    </div>
                    <div className="font-semibold 2xl:text-base text-sm">
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
                  backgroundImage:
                    "linear-gradient(to left top, #1cd8d2, #93edc7)",
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row 2xl:gap-5 gap-3 justify-center items-center">
                    <div className="bg-white/30 rounded-lg p-2 h-max">
                      <GiCheckMark className="2xl:w-[28px] 2xl:h-[28px] w-[20px] h-[20px]" />
                    </div>
                    <div className="font-semibold 2xl:text-base text-sm">
                      <p>Tasks</p>
                      <p>Completed</p>
                    </div>
                    <p className="font-bold text-3xl">{completeTaskValue}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex text-blue-500 gap-5 items-center">
              <p className="font-semibold 2xl:text-base text-sm">
                Browse Tasks
              </p>
            </div>
            <div className="flex gap-10 bg-blue-200 rounded-lg 2xl:pt-3 pt-2 px-10 mt-5 2xl:mb-5 mb-3 w-max">
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
                className="2xl:text-base text-sm border-blue-500 peer-checked/inProgress:border-b-8 peer-checked/inProgress:font-bold cursor-pointer w-[120px] 2xl:pb-5 pb-3 text-center"
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
                className="2xl:text-base text-sm border-blue-500 peer-checked/newAssigned:border-b-8 peer-checked/newAssigned:font-bold cursor-pointer w-[120px] 2xl:pb-5 pb-3 text-center"
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
                className="2xl:text-base text-sm border-blue-500 peer-checked/completed:border-b-8 peer-checked/completed:font-bold cursor-pointer w-[120px] 2xl:pb-5 pb-3 text-center"
              >
                Completed
              </label>
            </div>
            {showInProgress ? (
              <div className="2xl:max-h-[24rem] max-h-[14rem] overflow-y-scroll w-3/3">
                {plannerList
                  .filter((i) => {
                    return search.toLowerCase()
                      ? i.taskName.toLowerCase().includes(search)
                      : i;
                  })
                  .map((i, n) => {
                    if (new Date() < new Date(i.taskDuration)) {
                      return (
                        <>
                          <div
                            key={n}
                            className="bg-white rounded-lg 2xl:p-5 p-3 gap-5 flex items-center 2xl:mb-5 mb-3 shadow-md w-3/3"
                          >
                            <div
                              className="2xl:w-[50px] 2xl:h-[50px] w-[40px] h-[40px] rounded-lg"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                              }}
                            ></div>
                            <div className="flex flex-col gap-1 w-3/12">
                              <p className="font-bold 2xl:text-base text-sm">
                                {i.taskName}
                              </p>
                              <p className="text-gray-400 2xl:text-sm text-xs text-ellipsis truncate">
                                {i.taskDescription}
                              </p>
                            </div>
                            <div className="w-4/12">
                              <p className="text-gray-400 2xl:text-base text-sm">
                                {`Created: ${
                                  month[new Date(i.createdAt).getMonth()]
                                }
                      ${new Date(i.createdAt).getDate()}, 
                      ${new Date(i.createdAt).getFullYear()}`}
                              </p>
                              <p className="font-bold 2xl:text-base text-sm">
                                {`Due: ${
                                  month[new Date(i.taskDuration).getMonth()]
                                }
                      ${new Date(i.taskDuration).getDate()}, 
                      ${new Date(i.taskDuration).getFullYear()}`}
                              </p>
                            </div>
                            <div className="w-3/12 flex flex-col gap-3 justify-end">
                              <div className="flex justify-between">
                                <p className="2xl:text-sm text-xs">Remaining</p>
                                <p className="2xl:text-sm text-xs">
                                  {i.taskDurationNum >=
                                  new Date(
                                    new Date(i.taskDuration) - new Date()
                                  ).getDate() -
                                    1
                                    ? new Date(
                                        new Date(i.taskDuration) - new Date()
                                      ).getDate() - 1
                                    : 0}
                                  d
                                </p>
                              </div>
                              <div className="rounded-lg h-2 bg-[#00d2ff]/20">
                                <div
                                  className="rounded-lg h-2"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                                    width: `${
                                      (1 -
                                        (new Date(
                                          new Date(i.taskDuration) - new Date()
                                        ).getDate() -
                                          1) /
                                          i.taskDurationNum) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-1/12 flex justify-end">
                              <button
                                onClick={() => {
                                  setOpenTaskModal(!openTaskModal);
                                  setModalTaskName(i.taskName);
                                  setModalTaskDesc(i.taskDescription);
                                  setModalTaskDue(i.taskDuration);
                                  setModalTaskCreated(i.createdAt);
                                  setModalTaskTime(i.taskDueTime);
                                  setModalTaskRemaining(i.taskDurationNum);
                                  setModalId(i._id);
                                }}
                              >
                                <GoKebabVertical className="2xl:w-[20px] 2xl:h-[20px] w-[18px] h-[18px]" />
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            ) : null}
            {showNewAssigned ? (
              <div className="2xl:max-h-[24rem] max-h-[14rem] overflow-y-scroll w-3/3">
                {plannerList
                  .filter((i) => {
                    return search.toLowerCase()
                      ? i.taskName.toLowerCase().includes(search)
                      : i;
                  })
                  .map((i, n) => {
                    let now = `${
                      month[new Date().getMonth()]
                    } ${new Date().getDate()}, ${new Date().getFullYear()}`;
                    let created = `${
                      month[new Date(i.createdAt).getMonth()]
                    } ${new Date(i.createdAt).getDate()}, ${new Date(
                      i.createdAt
                    ).getFullYear()}`;

                    if (now === created) {
                      return (
                        <div
                          key={n}
                          className="bg-white rounded-lg 2xl:p-5 p-3 gap-5 flex items-center 2xl:mb-5 mb-3 shadow-md w-3/3"
                        >
                          <div
                            className="2xl:w-[50px] 2xl:h-[50px] w-[40px] h-[40px] rounded-lg"
                            style={{
                              backgroundImage:
                                "linear-gradient(to left top, #FF8008, #FFC837)",
                            }}
                          ></div>
                          <div className="flex flex-col gap-1 w-3/12">
                            <p className="font-bold 2xl:text-base text-sm">
                              {i.taskName}
                            </p>
                            <p className="text-gray-400 2xl:text-sm text-xs text-ellipsis truncate">
                              {i.taskDescription}
                            </p>
                          </div>
                          <div className="w-4/12">
                            <p className="text-gray-400 2xl:text-base text-sm">
                              {`Created: ${
                                month[new Date(i.createdAt).getMonth()]
                              }
                      ${new Date(i.createdAt).getDate()}, 
                      ${new Date(i.createdAt).getFullYear()}`}
                            </p>
                            <p className="font-bold 2xl:text-base text-sm">
                              {`Due: ${
                                month[new Date(i.taskDuration).getMonth()]
                              }
                      ${new Date(i.taskDuration).getDate()}, 
                      ${new Date(i.taskDuration).getFullYear()}`}
                            </p>
                          </div>
                          <div className="w-3/12 flex flex-col gap-3 justify-end">
                            <div className="flex text-[#FF8008] gap-5 items-center">
                              <CgToday className="2xl:w-[32px] 2xl:h-[32px] w-[28px] h-[28px]" />
                              <p className="2xl:text-sm text-xs text-black">
                                Today
                              </p>
                            </div>
                          </div>
                          <div className="w-1/12 flex justify-end">
                            <button
                              onClick={() => {
                                setOpenTaskNewModal(!openTaskNewModal);
                                setModalTaskName(i.taskName);
                                setModalTaskDesc(i.taskDescription);
                                setModalTaskDue(i.taskDuration);
                                setModalTaskCreated(i.createdAt);
                                setModalTaskTime(i.taskDueTime);
                                setModalTaskRemaining(i.taskDurationNum);
                                setModalId(i._id);
                              }}
                            >
                              <GoKebabVertical className="2xl:w-[20px] 2xl:h-[20px] w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            ) : null}
            {showCompleted ? (
              <div className="2xl:max-h-[24rem] max-h-[14rem] overflow-y-scroll w-3/3">
                {plannerList
                  .filter((i) => {
                    return search.toLowerCase()
                      ? i.taskName.toLowerCase().includes(search)
                      : i;
                  })
                  .map((i, n) => {
                    if (new Date() > new Date(i.taskDuration)) {
                      return (
                        <div
                          key={n}
                          className="bg-white rounded-lg 2xl:p-5 p-3 gap-5 flex items-center 2xl:mb-5 mb-3 shadow-md w-3/3"
                        >
                          <div
                            className="2xl:w-[50px] 2xl:h-[50px] w-[40px] h-[40px] rounded-lg"
                            style={{
                              backgroundImage:
                                "linear-gradient(to left top, #1cd8d2, #93edc7)",
                            }}
                          ></div>
                          <div className="flex flex-col gap-1 w-3/12">
                            <p className="font-bold 2xl:text-base text-sm">
                              {i.taskName}
                            </p>
                            <p className="text-gray-400 2xl:text-sm text-xs text-ellipsis truncate">
                              {i.taskDescription}
                            </p>
                          </div>
                          <div className="w-4/12">
                            <p className="text-gray-400 2xl:text-base text-sm">
                              {`Created: ${
                                month[new Date(i.createdAt).getMonth()]
                              }
                    ${new Date(i.createdAt).getDate()}, 
                    ${new Date(i.createdAt).getFullYear()}`}
                            </p>
                            <p className="font-bold 2xl:text-base text-sm">
                              {`Due: ${
                                month[new Date(i.taskDuration).getMonth()]
                              }
                    ${new Date(i.taskDuration).getDate()}, 
                    ${new Date(i.taskDuration).getFullYear()}`}
                            </p>
                          </div>
                          <div className="w-3/12 flex flex-col gap-3 justify-end">
                            <div className="flex justify-between items-center">
                              <p className="2xl:text-sm text-xs">Completed</p>
                              <p className="text-sm text-[#1cd8d2]">
                                <TbDiscountCheckFilled size={20} />
                              </p>
                            </div>
                            <div className="rounded-lg h-2">
                              <div
                                className="rounded-lg h-2"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(to left top, #1cd8d2, #93edc7)",
                                  width: "100%",
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-1/12 flex justify-end">
                            <button
                              onClick={() => {
                                setOpenTaskCompleteModal(
                                  !openTaskCompleteModal
                                );
                                setModalTaskName(i.taskName);
                                setModalTaskDesc(i.taskDescription);
                                setModalTaskDue(i.taskDuration);
                                setModalTaskCreated(i.createdAt);
                                setModalTaskTime(i.taskDueTime);
                                setModalTaskRemaining(i.taskDurationNum);
                                setModalId(i._id);
                              }}
                            >
                              <GoKebabVertical className="2xl:w-[20px] 2xl:h-[20px] w-[18px] h-[18px]" />
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            ) : null}
          </div>
          <div className="w-1/3 2xl:ml-4 border-l border-gray-300 pl-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex 2xl:gap-5 gap-1 bg-blue-200 rounded-lg 2xl:pt-3 pt-2 2xl:px-5 2xl:mt-5 2xl:mb-5 mb-3 w-max">
                <input
                  type="radio"
                  id="pomodoro"
                  name="timer"
                  value="pomodoro"
                  className="peer/pomodoro hidden"
                  onChange={() => {
                    changeTimer(1500, "pomodoro");
                    setTimerState("");
                  }}
                  defaultChecked
                />
                <label
                  htmlFor="pomodoro"
                  className="2xl:text-base text-sm border-blue-500 peer-checked/pomodoro:border-b-8 peer-checked/pomodoro:font-bold cursor-pointer w-[120px] 2xl:pb-5 pb-3 text-center"
                >
                  Pomodoro
                </label>
                <input
                  type="radio"
                  id="short"
                  name="timer"
                  value="short"
                  className="peer/short hidden"
                  onChange={() => {
                    changeTimer(300, "short");
                    setTimerState("");
                  }}
                />
                <label
                  htmlFor="short"
                  className="2xl:text-base text-sm border-blue-500 peer-checked/short:border-b-8 peer-checked/short:font-bold cursor-pointer w-[120px] 2xl:pb-5 pb-3 text-center"
                >
                  Short Break
                </label>
                <input
                  type="radio"
                  id="long"
                  name="timer"
                  value="completed"
                  className="peer/long hidden"
                  onChange={() => {
                    changeTimer(600, "long");
                    setTimerState("");
                  }}
                />
                <label
                  htmlFor="long"
                  className="2xl:text-base text-sm border-blue-500 peer-checked/long:border-b-8 peer-checked/long:font-bold cursor-pointer w-[120px] 2xl:pb-5 pb-3 text-center"
                >
                  Long Break
                </label>
              </div>
              <div
                className="2xl:rounded-[2rem] rounded-[1.5rem] 2xl:p-5 p-3 shadow-xl w-max text-white 2xl:text-9xl text-8xl"
                style={{
                  backgroundImage:
                    "linear-gradient(to right bottom, #b06ab3, #4568dc)",
                }}
              >
                {minutes >= 10 ? minutes : `0${minutes}`}:
                {seconds >= 10 ? seconds : `0${seconds}`}
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  className={`text-white p-2 h-max bg-gray-300 rounded-lg hover:bg-gradient-to-br from-[#b06ab3] hover:text-white to-[#4568dc] ${
                    timerState === "play"
                      ? "bg-gradient-to-br from-[#b06ab3] to-[#4568dc] text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => {
                    setTimerState("play");
                    setTimerPause(!timerPause);
                    resume();
                  }}
                >
                  <CiPlay1 className="2xl:w-[36px] 2xl:h-[36px] w-[24px] h-[24px]" />
                </button>
                <button
                  className={`text-white p-2 h-max bg-gray-300 rounded-lg hover:bg-gradient-to-br from-[#b06ab3] hover:text-white to-[#4568dc] ${
                    timerState === "pause"
                      ? "bg-gradient-to-br from-[#b06ab3] to-[#4568dc] text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => {
                    setTimerState("pause");
                    setTimerPause(!timerPause);
                    pause();
                  }}
                >
                  <CiPause1 className="2xl:w-[36px] 2xl:h-[36px] w-[24px] h-[24px]" />
                </button>
                <button
                  className="p-2 h-max rounded-lg text-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right bottom, #b06ab3, #4568dc)",
                  }}
                  onClick={() => {
                    if (timerDuration === "pomodoro") {
                      changeTimer(1500, "pomodoro");
                    } else if (timerDuration === "short") {
                      changeTimer(300, "short");
                    } else if (timerDuration === "long") {
                      changeTimer(600, "long");
                    }
                  }}
                >
                  <CiRedo className="2xl:w-[36px] 2xl:h-[36px] w-[24px] h-[24px]" />
                </button>
              </div>
            </div>
            <div className="flex text-blue-500 2xl:gap-5 gap-3 2xl:mt-5 mt-3 flex-col justify-start">
              <p className="font-semibold 2xl:text-base text-sm">
                Browse Todo List
              </p>
              <div>
                <button
                  className="2xl:px-5 2xl:py-2.5 2xl:text-base bg-white hover:bg-blue-200 font-medium rounded-lg 
                  px-4 py-2 text-sm text-center shadow-lg mr-5 flex items-center gap-2 text-md transition duration-200 text-blue-400 hover:text-white w-full justify-center"
                  onClick={() => {
                    setOpenModalTodo(!openModalTodo);
                  }}
                >
                  Add Todo
                  <FaPlus className="ml-2" />
                </button>
                <div className="2xl:max-h-[12.5rem] max-h-[7rem] overflow-y-scroll w-full 2xl:mt-5 mt-3">
                  {todoList.map((i) => {
                    return (
                      <button
                        className="relative bg-white rounded-lg 2xl:p-5 p-3 gap-5 flex items-center 2xl:mb-5 mb-3 shadow-md w-full"
                        onClick={(e) => {
                          handleMarkTodoDone(e, !i.markDone, i._id);
                        }}
                      >
                        <div
                          className={`absolute ${
                            i.markDone ? "bg-[#1cd8d2]" : "bg-gray-400"
                          } w-[15px] h-full rounded-l-lg left-0`}
                        ></div>
                        <div>
                          {i.markDone ? (
                            <TbDiscountCheckFilled className="text-[#1cd8d2] ml-3 text-2xl" />
                          ) : (
                            <TbDiscountCheck className="text-gray-400 ml-3 text-2xl" />
                          )}
                        </div>
                        <p className="text-black font-medium break-all 2xl:text-base text-sm">
                          {i.todoDescription}
                        </p>
                        <button
                          onClick={(e) => {
                            handleDeleteTodo(e, i._id);
                          }}
                          className="text-red-500 absolute right-5"
                        >
                          <IoCloseOutline size={24} />
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;
