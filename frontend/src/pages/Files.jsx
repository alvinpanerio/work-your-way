import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { FaSearch } from "react-icons/fa";

function Files() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="2xl:pt-56 md:pt-48">
      <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
        <SideBar />
        <div className="relative">
          <input
            type="text"
            id="seacrh"
            placeholder="Search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5"
          />
          <FaSearch className="absolute left-3.5 top-3.5 opacity-20" />
        </div>
        <div>
          <button>
            
          </button>
        </div>
      </div>
    </div>
  );
}

export default Files;
