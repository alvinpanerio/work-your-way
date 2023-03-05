import { useEffect, useState, useContext } from "react";

function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      setName(JSON.parse(isAuth).email);
      setIsLogged(true);
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
