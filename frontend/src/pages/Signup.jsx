import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import RiseLoader from "react-spinners/RiseLoader";
import axios from "axios";
import Card from "../components/Card";
import Home from "./Home";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submit, setSubmit] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (
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
    <div className="flex justify-between mt-20 container mx-auto">
      <Home></Home>
      <Card>
        {submitting ? (
          <div className="h-full flex justify-center items-center">
            <RiseLoader color="#3b82f6" margin={2} size={30} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>Sign Up</p>
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
            <div className="flex flex-col">
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePassword}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirm-password">Confirm Password*</label>
              <input
                type="password"
                id="confirm-password"
                value={passwordConfirm}
                onChange={handlePasswordConfirmation}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              />
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
