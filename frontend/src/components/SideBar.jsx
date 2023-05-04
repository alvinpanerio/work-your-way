import { Link } from "react-router-dom";

import {
  TbHome,
  TbBrandHipchat,
  TbCalendarTime,
  TbTrophy,
  TbFileDescription,
} from "react-icons/tb";

import { MdWorkspacesFilled } from "react-icons/md";
function SideBar({ groupChatNameDisplay, setGroupChatNameDisplay }) {
  return (
    <nav className="z-30">
      <div className="fixed bg-blue-500 h-full 2xl:w-[4%] w-[4.5%] top-0 left-0">
        <li className="list-none flex flex-col items-center gap-6">
          <ul>
            <Link to={"/"}>
              <button>
                <MdWorkspacesFilled className="text-white my-6 2xl:w-[40px] 2xl:h-[40px] w-[30px] h-[30px]" />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbHome className="2xl:w-[25px] 2xl:h-[25px] w-[20px] h-[20px]" />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/files"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbFileDescription className="2xl:w-[25px] 2xl:h-[25px] w-[20px] h-[20px]" />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/chat"}>
              <button
                className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300"
                onClick={() => {
                  if (groupChatNameDisplay) {
                    setGroupChatNameDisplay("");
                  }
                }}
              >
                <TbBrandHipchat className="2xl:w-[25px] 2xl:h-[25px] w-[20px] h-[20px]" />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/planner"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbCalendarTime className="2xl:w-[25px] 2xl:h-[25px] w-[20px] h-[20px]" />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/leaderboards"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbTrophy className="2xl:w-[25px] 2xl:h-[25px] w-[20px] h-[20px]" />
              </button>
            </Link>
          </ul>
        </li>
      </div>
    </nav>
  );
}

export default SideBar;
