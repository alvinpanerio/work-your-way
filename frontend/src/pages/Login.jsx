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
          <Button
            to={"/login"}
            n={"700"}
            h={"800"}
            add={"w-full ml-0 mt-3 flex justify-center"}
          >
            Log In
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Login;
