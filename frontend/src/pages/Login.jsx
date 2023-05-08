import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Card from "../components/Card";
import Home from "./Home";
import LoadingProvider from "../context/LoadingContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const { setIsLoading } = useContext(LoadingProvider);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(process.env.REACT_APP_API_URI + "/login", {
          email,
          password,
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.token) {
              localStorage.setItem("user", JSON.stringify(res.data));
            }
            // window.location.reload(true);
            setIsLoading(true);
            navigate("/");
          }
        })
        .catch((err) => {
          setError(`${err.response.data.error}`);
          console.log(err.response);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  return (
    <div className="pr-20 flex flex-wrap justify-between pt-40 container mx-auto">
      <div className="-mt-40 w-[96px]">
        <Home addClass={"ml-[300px] mt-36"} />
      </div>
      <Card>
        <form
          onSubmit={handleSubmit}
          className="text-[#102c54] text-lg font-medium"
        >
          <p className="text-[#102c54] 2xl:text-3xl text-2xl font-bold mb-3">
            Log In
          </p>
          <div className="flex flex-col">
            <label htmlFor="email" className="my-1 2xl:text-base text-sm">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmail}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 p-2"
            />
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="password" className="my-1 2xl:text-base text-sm">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={show ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePassword}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 p-2"
            />
            {show ? (
              <FaEyeSlash
                onClick={() => {
                  setShow(false);
                }}
                cclassName="2xl:top-12 2xl:left-72 top-10 left-[18.5rem] cursor-pointer absolute 2xl:w-5 h-4 w-4"
              ></FaEyeSlash>
            ) : (
              <FaEye
                onClick={() => {
                  setShow(true);
                }}
                className="2xl:top-12 2xl:left-72 top-10 left-[18.5rem] cursor-pointer absolute 2xl:w-5 h-4 w-4"
              ></FaEye>
            )}
          </div>
          {error && <div className="text-red-600 mt-3">{error}</div>}
          <div className="flex justify-end mt-2">
            <Link
              to={"/forgot"}
              className="font-medium text-blue-500 2xl:text-base text-sm"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type={"submit"}
            className="inline-flex items-center text-white 
              bg-blue-500 hover:bg-blue-700 font-medium rounded-lg 2xl:text-base text-sm px-5 2xl:py-2.5 py-2 text-center w-full mt-3 flex justify-center"
          >
            Log In
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
