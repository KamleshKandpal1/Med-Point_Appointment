import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  // console.log(state);
  const navigateAdmin = useNavigate();
  const navigateDoctor = useNavigate();

  const onHandleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Admin login logic
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/v1/admin/login", {
          email,
          password,
        });

        if (data.success) {
          // Store token in localStorage and in state
          localStorage.setItem("token", data.data);
          setToken(data.data);
          toast.success(data.message);
          navigateAdmin("/admin-dashboard"); // Success toast with backend message
        } else {
          toast.error("Invalid Credentials"); // Error toast for invalid credentials
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/v1/doctor/login", {
          email,
          password,
        });

        if (data.success) {
          // Store token in localStorage and in state
          // console.log(data.data);
          localStorage.setItem("dtoken", data.data);
          setDToken(data.data);
          toast.success(data.message); // Success toast with backend message
          navigateDoctor("/doctor-dashboard");
        } else {
          toast.error(data.message); // Error toast for invalid credentials
        }
      }
    } catch (error) {
      toast.error(error.message || "Invalid Credentials ");
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <form
      action=""
      onSubmit={onHandleSubmit}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5d] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full flex flex-col gap-1">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name=""
            id=""
            required
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <p>Password</p>
          <div className="relative">
            <input
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              required
            />
            <img
              src={showPassword ? assets.open_eye : assets.closed_eye}
              className="absolute top-[14px] right-2 h-5 w-5 text-black cursor-pointer"
              onClick={handleShowPassword}
              aria-label="Toggle password visibility"
              alt={showPassword ? "Hide password" : "Show password"}
            />
          </div>
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => setState("Admin")}
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
