import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";
import Button from "../shared/Button";
import LoadingProvider from "../context/LoadingContext";

function NavBar() {
  const { isLogged, setIsLogged, setIsLoading } = useContext(LoadingProvider);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  const logout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem("user");
      console.log("logout");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-5">
      <nav className="flex justify-between container mx-auto">
        <div className="flex items-center">
          <Link to={"/"}>Workspace</Link>
        </div>
        {isLogged ? (
          <div>
            <Button onclick={logout} size={"base"} n={"700"} h={"800"}>
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
