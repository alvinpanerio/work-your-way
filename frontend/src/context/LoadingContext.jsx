import { createContext, useState, useEffect } from "react";
import axios from "axios";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [name, setName] = useState("");

  const [filesArr, setFilesArr] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [isLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isLogged,
        setIsLogged,
        name,
        setName,
        filesArr,
        setFilesArr,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
