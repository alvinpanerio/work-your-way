import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../shared/Button";

function NavBar() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      setIsLogged(true);
    }
  }, []);

  return (
    <div className="mt-5">
      <nav className="flex justify-between container mx-auto">
        <div className="flex items-center">
          <Link to={"/"}>Workspace</Link>
        </div>
        {isLogged ? (
          <div>
            <Button to={"/login"} size={"base"} n={"700"} h={"800"}>
              Log Out
            </Button>
          </div>
        ) : (
          <div>
            <Button to={"/login"} size={"base"} n={"700"} h={"800"}>
              Log In
            </Button>
            <Button to={"/signup"} size={"base"} n={"400"} h={"500"}>
              Sign Up
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
