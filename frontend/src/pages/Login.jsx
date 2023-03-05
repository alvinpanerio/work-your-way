import Card from "../components/Card";
import Button from "../shared/Button";
import Home from "./Home";

function Login() {
  return (
    <div className="flex justify-between mt-20 container mx-auto">
      <Home></Home>
      <Card>
        <form action="">
          <p>Log In</p>
          <div className="flex flex-col">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
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
