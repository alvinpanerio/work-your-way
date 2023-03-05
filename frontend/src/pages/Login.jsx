import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Home from "./Home";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:4000/login", {
          email,
          password,
        })
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
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
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
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
          {error && <div className="text-red-600 mt-3">{error}</div>}
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
