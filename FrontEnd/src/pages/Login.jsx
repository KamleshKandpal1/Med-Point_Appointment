import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import { BiHide, BiShow } from "react-icons/bi";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const naviagte = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign up") {
        const { data } = await axios.post(
          backendUrl + "/api/v1/user/register",
          {
            name,
            email,
            password,
          }
        );
        if (data.success) {
          // console.log(data);
          localStorage.setItem("token", data.data);
          setToken(data.data);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/v1/user/login", {
          email,
          password,
        });
        if (data.success) {
          // console.log(data);

          localStorage.setItem("token", data.data);
          setToken(data.data);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      naviagte("/");
    }
  }, [token]);

  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000); // Clear message after 2 seconds
  };

  const [showAndHidePasswords, setShowAndHidePasswords] = useState(true);
  const showAndHidePassword = () => {
    setShowAndHidePasswords((prev) => !prev);
  };

  const [showPassword, setShowPassword] = useState(true);
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-zinc-600 text-sm shadow-lg border border-gray-300">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up " : "log in"} to book
          appointment
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full mt-1 p-2"
              type="text"
              name=" "
              id=""
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full mt-1 p-2"
            type="email"
            name=" "
            id=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <div className="relative">
            <input
              className="border border-zinc-300 rounded w-full mt-1 p-2"
              type={showPassword ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onMouseDown={handleShowPassword}
              className="text-gray-500 hover:text-blue-600 text-base absolute top-4 right-3"
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </button>
          </div>
        </div>
        {/* Show username and password */}
        {state === "Sign Up" ? (
          ""
        ) : (
          <div className="flex flex-col gap-4 w-full items-center border border-gray-300 p-4 rounded-md shadow-xl">
            {/* Username */}
            <div className="flex w-full items-center font-medium text-sm">
              <div className="flex items-center justify-between w-full">
                <p>kamlesh2@gmail.com</p>
                <button
                  type="button"
                  onMouseDown={() =>
                    handleCopy("kamlesh2@gmail.com", "Username")
                  }
                  className="text-gray-500 hover:text-blue-600 text-base"
                >
                  <FiCopy />
                </button>
                {copiedField === "Username" && (
                  <span className="ml-2 text-green-500 text-sm">Copied!</span>
                )}
              </div>
            </div>
            {/* Password */}
            <div className="flex w-full items-center font-medium text-sm">
              <div className="flex items-center justify-between w-full">
                <p>{showAndHidePasswords ? "************" : "1234567890"}</p>
                <div className="flex items-center gap-x-3">
                  <button
                    type="button"
                    onMouseDown={showAndHidePassword}
                    className="text-gray-500 hover:text-blue-600 text-base"
                  >
                    {showAndHidePasswords ? <BiHide /> : <BiShow />}
                  </button>
                  <button
                    type="button"
                    onMouseDown={() => handleCopy("1234567890", "Password")}
                    className="text-gray-500 hover:text-blue-600 text-base"
                  >
                    <FiCopy />
                  </button>
                </div>
                {copiedField === "Password" && (
                  <span className="ml-2 text-green-500 text-sm">Copied!</span>
                )}
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
