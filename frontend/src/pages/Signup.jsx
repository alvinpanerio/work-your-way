import { useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Button from "../shared/Button";
import Home from "./Home";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/signup", {
        username: email,
        password,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-between mt-20 container mx-auto">
      <Home></Home>
      <Card>
        <form onSubmit={handleSubmit}>
          <p>Sign Up</p>
          <div className="flex flex-col">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Confirm Password*</label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
          </div>
          <button type="submit">
            asdasd
            {/* <Button
              n={"700"}
              h={"800"}
              add={"w-full ml-0 mt-3 flex justify-center"}
            >
              Signup
            </Button> */}
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
