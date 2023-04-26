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
      <div className="fixed bg-blue-500 h-full w-[4%] top-0 left-0">
        <li className="list-none flex flex-col items-center gap-6">
          <ul>
            <Link to={"/"}>
              <button>
                <MdWorkspacesFilled size={40} className="text-white my-6" />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbHome size={25} />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/files"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbFileDescription size={25} />
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
                <TbBrandHipchat size={25} />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/planner"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbCalendarTime size={25} />
              </button>
            </Link>
          </ul>
          <ul>
            <Link to={"/leaderboards"}>
              <button className="text-white hover:text-blue-500 hover:bg-white rounded-md p-2 transition duration-300">
                <TbTrophy size={25} />
              </button>
            </Link>
          </ul>
        </li>
      </div>
    </nav>
  );
}

export default SideBar;
