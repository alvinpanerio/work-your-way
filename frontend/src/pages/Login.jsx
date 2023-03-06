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
        .post("http://localhost:4000/login", {
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
    <div className="flex justify-between mt-20 container mx-auto">
      <Home></Home>
      <Card>
        <form onSubmit={handleSubmit}>
          <p>Log In</p>
          <div className="flex flex-col">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmail}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
          </div>
          <div className="relative flex flex-col">
            <label htmlFor="password">Password*</label>
            <input
              type={show ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePassword}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
            {show ? (
              <FaEyeSlash
                onClick={() => {
                  setShow(false);
                }}
                className="top-9 left-72 cursor-pointer absolute h-5 w-5"
              ></FaEyeSlash>
            ) : (
              <FaEye
                onClick={() => {
                  setShow(true);
                }}
                className="top-9 left-72 cursor-pointer absolute h-5 w-5"
              ></FaEye>
            )}
          </div>
          {error && <div className="text-red-600 mt-3">{error}</div>}
          <div className="flex justify-end mt-2">
            <Link to={"/forgot"} className={"font-medium text-blue-500"}>
              Forgot Password?
            </Link>
          </div>
          <button
            type={"submit"}
            className="inline-flex items-center text-white 
              bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-base px-5 py-2.5 text-center w-full mt-3 flex justify-center"
          >
            Log In
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
