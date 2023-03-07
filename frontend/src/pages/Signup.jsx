import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import RiseLoader from "react-spinners/RiseLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Card from "../components/Card";
import Home from "./Home";
import Avatars from "../assets/avatars/Avatars";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submit, setSubmit] = useState(true);
  const [show, setShow] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(
    "/static/media/female-bangs.edb240080c99c12324da.png"
  );

  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    console.log(profileAvatar);
  }, [profileAvatar]);

  useEffect(() => {
    if (
      profileAvatar &&
      email &&
      password.length > 7 &&
      passwordConfirm.length > 7 &&
      password === passwordConfirm
    ) {
      setSubmit(false);
    } else {
      setSubmit(true);
    }
  }, [email, password, passwordConfirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        profileAvatar &&
        email &&
        password.length > 7 &&
        passwordConfirm.length > 7 &&
        password === passwordConfirm
      ) {
        setSubmitting(true);
        await axios
          .post("http://localhost:4000/signup", {
            email,
            password,
            profileDetails: {
              profileAvatar,
            },
          })
          .then((res) => {
            console.log(res.status);
            if (res.status === 200) {
              setSubmitting(false);
              setError("");
              navigate("/login");
            }
          })
          .catch((err) => {
            setError(`${err.response.data.error}`);
            console.log(err.response);
          });
        setSubmitting(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePassword = (e) => {
    if (e.target.value.length < 8) {
      setSubmit(true);
      setPassword(e.target.value);
      return setError("Password must at least 8 characters!");
    } else {
      setPassword(e.target.value);
    }
    setError("");
  };

  const handlePasswordConfirmation = (e) => {
    if (password !== e.target.value) {
      setSubmit(true);
      setPasswordConfirm(e.target.value);
      return setError("Password must match!");
    } else {
      setPasswordConfirm(e.target.value);
    }
    setError("");
  };

  return (
    <div className="flex flex-wrap justify-between mt-20 container mx-auto">
      <Home></Home>
      <Card>
        {submitting ? (
          <div className="h-full flex justify-center items-center">
            <RiseLoader color="#3b82f6" margin={2} size={30} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>Sign Up</p>
            <div>
              <p>Choose an Avatar*</p>
              <div className="flex flex-wrap gap-y-5 my-5 justify-center">
                {Avatars.map((avatar, i) => {
                  return (
                    <label
                      htmlFor={avatar}
                      className="checked cursor-pointer mr-5"
                      key={i}
                    >
                      {i === 0 ? (
                        <input
                          type="radio"
                          name="avatars"
                          id={avatar}
                          value={avatar}
                          className="appearance-none hidden"
                          onChange={(e) => setProfileAvatar(e.target.value)}
                          defaultChecked
                        />
                      ) : (
                        <input
                          type="radio"
                          name="avatars"
                          id={avatar}
                          value={avatar}
                          className="appearance-none hidden"
                          onChange={(e) => setProfileAvatar(e.target.value)}
                        />
                      )}

                      <img src={avatar} alt="" className="w-14 h-14" />
                    </label>
                  );
                })}
              </div>
            </div>
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
            <div className="relative flex flex-col">
              <label htmlFor="confirm-password">Confirm Password*</label>
              <input
                type={show ? "text" : "password"}
                id="confirm-password"
                value={passwordConfirm}
                onChange={handlePasswordConfirmation}
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
            <button
              type="submit"
              disabled={submit}
              className={`inline-flex items-center text-white ${
                submit ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
              }  font-medium 
      rounded-lg text-base px-5 py-2.5 text-center w-full mt-3 flex justify-center`}
            >
              Signup
            </button>
            <div className="flex justify-end mt-2">
              <Link to={"/forgot"} className={"font-medium text-blue-500"}>
                Forgot Password?
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default Login;
