import { useContext, useEffect } from "react";
import LoadingProvider from "../context/LoadingContext";
function Home() {
  const { isLogged, setIsLogged, setName, name } = useContext(LoadingProvider);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      setName(JSON.parse(isAuth).email);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  return (
    <div>
      <p className="text-9xl flex items-center justify-center mt-32">
        {isLogged ? `Hello ${name}` : "HOME"}
      </p>
    </div>
  );
}

export default Home;
