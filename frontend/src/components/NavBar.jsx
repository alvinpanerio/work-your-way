import { Link } from "react-router-dom";
import Button from "../shared/Button";

function NavBar() {
  return (
    <div className="mt-5">
      <nav className="flex justify-between container mx-auto">
        <div className="flex items-center">
          <Link to={"/"}>Workspace</Link>
        </div>
        <div>
          <Button to={"/login"} size={"base"} n={"700"} h={"800"}>
            Log In
          </Button>
          <Button to={"/signup"} size={"base"} n={"400"} h={"500"}>
            Sign Up
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
