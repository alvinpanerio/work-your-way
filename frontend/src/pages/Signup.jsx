import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import RiseLoader from "react-spinners/RiseLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
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
  const [showLoginConfirm, setShowLoginConfirm] = useState(false);

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
          .post(process.env.REACT_APP_API_URI + "/signup", {
            email,
            password,
            profileDetails: { uid: 0, profileAvatar },
          })
          .then((res) => {
            if (res.status === 200) {
              setSubmitting(false);
              setShowLoginConfirm(true);
              setError("");
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
    <div className="pr-20 flex flex-wrap justify-between pt-40 container mx-auto ">
      <div
        className={`h-full w-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 fixed bg-zinc-900/50 z-40 ${
          showLoginConfirm ? "visible" : "hidden"
        }`}
      >
        <div
          className="bg-white rounded-lg absolute z-50 left-1/2 top-1/2 -translate-y-1/2 opacity-100 -translate-x-1/2 p-8 flex flex-col 
        justify-center items-center"
        >
          <div className="flex w-full justify-between text-blue-500 font-bold items-center mb-5">
            <p className="text-2xl">Registered Successfully!</p>
            <button
              onClick={() => {
                setShowLoginConfirm(false);
                navigate("/login");
              }}
            >
              <MdClose size={28} />
            </button>
          </div>
          <div className="w-[500px] text-lg flex flex-col text-center">
            <p className="mb-5">
              Thank you for signing up! Your registration is now complete.
              Please visit your email inbox for the confirmation.
            </p>
            <p>Please close this window to access the login page.</p>
          </div>
        </div>
      </div>
      <div className="-mt-40 w-[96px]">
        <Home addClass={"ml-[300px] mt-36"} />
      </div>
      <Card>
        {submitting ? (
          <div className="h-full flex justify-center items-center">
            <RiseLoader color="#3b82f6" margin={2} size={30} />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="text-[#102c54] text-lg font-medium"
          >
            <p className="text-[#102c54] 2xl:text-3xl text-2xl font-bold mb-3">
              Sign Up
            </p>
            <div>
              <p className="2xl:text-base text-sm">
                Choose an Avatar
                <span className="2xl:text-base text-sm text-red-500">*</span>
              </p>
              <div className="flex flex-wrap 2xl:gap-y-5 gap-y-3 2xl:my-5 my-3 justify-center">
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

                      <img
                        src={avatar}
                        alt=""
                        className="2xl:w-14 2xl:h-14 w-12 h-12"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
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
                  className="2xl:top-12 2xl:left-72 top-10 left-[18.5rem] cursor-pointer absolute 2xl:h-5 2xl:w-5 2xl:w-5 h-4 w-4"
                ></FaEyeSlash>
              ) : (
                <FaEye
                  onClick={() => {
                    setShow(true);
                  }}
                  className="2xl:top-12 2xl:left-72 top-10 left-[18.5rem] cursor-pointer absolute 2xl:h-5 2xl:w-5 2xl:w-5 h-4 w-4"
                ></FaEye>
              )}
            </div>
            <div className="relative flex flex-col">
              <label
                htmlFor="confirm-password"
                className="my-1 2xl:text-base text-sm"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={show ? "text" : "password"}
                id="confirm-password"
                value={passwordConfirm}
                onChange={handlePasswordConfirmation}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full 2xl:p-2.5 p-2"
              />
              {show ? (
                <FaEyeSlash
                  onClick={() => {
                    setShow(false);
                  }}
                  className="2xl:top-12 2xl:left-72 top-10 left-[18.5rem] cursor-pointer absolute 2xl:h-5 2xl:w-5 2xl:w-5 h-4 w-4"
                ></FaEyeSlash>
              ) : (
                <FaEye
                  onClick={() => {
                    setShow(true);
                  }}
                  className="2xl:top-12 2xl:left-72 top-10 left-[18.5rem] cursor-pointer absolute 2xl:h-5 2xl:w-5 2xl:w-5 h-4 w-4"
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
      rounded-lg 2xl:text-base text-sm px-5 2xl:py-2.5 py-2 text-center w-full mt-3 flex justify-center`}
            >
              Signup
            </button>
            <div className="flex justify-end mt-2">
              <Link
                to={"/forgot"}
                className="font-medium text-blue-500 2xl:text-base text-sm"
              >
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
