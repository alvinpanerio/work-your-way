import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import Card from "../components/Card";
import LoadingProvider from "../context/LoadingContext";

function PasswordReset() {
  const { resetToken } = useParams();
  const { isAllowed, setIsAllowed } = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [submit, setSubmit] = useState(true);

  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoadingProvider);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/forgot/${resetToken}`)
      .then((res) => {
        if (res.status === 200) {
          setIsAllowed(true);
        }
      })
      .catch((err) => {
        navigate(`../${err.response.data.redirect}`);
        console.log("error");
      });
  }, []);

  useEffect(() => {
    if (
      password.length > 7 &&
      passwordConfirm.length > 7 &&
      password === passwordConfirm
    ) {
      setSubmit(false);
    } else {
      setSubmit(true);
    }
  }, [password, passwordConfirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        password.length > 7 &&
        passwordConfirm.length > 7 &&
        password === passwordConfirm
      ) {
        await axios
          .put(`http://localhost:4000/forgot/${resetToken}`, {
            password,
          })
          .then((res) => {
            console.log(res.status);
            if (res.status === 200) {
              setIsLoading(true);
              navigate("/login");
            }
          })
          .catch((err) => {
            navigate(`../${err.response.data.redirect}`);
            console.log("error");
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setError("Password must at least 8 characters!");
    } else {
      setError("");
    }
  };

  const handlePasswordConfirmation = (e) => {
    e.preventDefault();
    setPasswordConfirm(e.target.value);
    console.log(submit);
    if (password.length < 8 || e.target.value !== password) {
      setSubmit(true);
      setError("Password must match!");
    } else {
      setSubmit(false);
      setError("");
    }
  };
  return (
    <div>
      {isAllowed ? (
        ""
      ) : (
        <div className="flex justify-center items-center mt-48">
          <Card>
            <form onSubmit={handleSubmit}>
              <p>Password Reset</p>
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
              <div className="flex flex-col">
                <label htmlFor="confirm-password">Confirm Password*</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmation}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                />
              </div>
              {error && <div className="text-red-600 mt-3">{error}</div>}
              <button
                type="submit"
                disabled={submit}
                className={`inline-flex items-center text-white ${
                  submit ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-700"
                }  font-medium 
rounded-lg text-base px-5 py-2.5 text-center w-full mt-3 flex justify-center`}
              >
                Reset
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PasswordReset;
