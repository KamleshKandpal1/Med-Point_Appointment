import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const naviagte = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  // const [token, setToken] = useState(true);
  const { token, setToken, userData } = useContext(AppContext);
  const location = useLocation();
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };
  return (
    <div className="flex items-center justify-between text-sm py-4 border-b border-b-gray-400">
      {/* bg-primary z-20 px-5 sticky top-0  */}
      <img
        onClick={() => naviagte("/")}
        className="w-36 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1 uppercase">Home</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctor">
          <li className="py-1 uppercase">All Doctors</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about-us">
          <li className="py-1 uppercase">About</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact-us">
          <li className="py-1 uppercase">Contact</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5 " src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20  hidden group-hover:block transition-hover duration-500">
              <div className="min-w-48 bg-stone-100 rounded-lg flex flex-col gap-4 p-4">
                <li
                  onClick={() => naviagte("my-profile")}
                  className="flex gap-2 list-none hover:text-black cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <p>My Profile</p>
                </li>
                <li
                  onClick={() => naviagte("my-appointment")}
                  className="flex gap-2 list-none hover:text-black cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                    />
                  </svg>
                  <p>My Appointment</p>
                </li>
                <li
                  onClick={logout}
                  className="flex gap-2 list-none hover:text-black cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                  <p>Logout</p>
                </li>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => naviagte("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-normal hidden md:block"
          >
            Create Accout
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />
        {/* Mobile Menu */}
        <div
          className={`md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all ${
            showMenu ? "w-full fixed" : "h-0 w-0"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              onClick={() => setShowMenu(false)}
              className="w-7 cursor-pointer"
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 text-lg font-medium uppercase">
            <NavLink
              className={`px-4 py-2 w-[90%] mx-auto text-center rounded inline-block ${
                location.pathname === "/" ? "bg-primary text-white" : ""
              }`}
              onClick={() => {
                setShowMenu(false);
              }}
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className={`px-4 py-2 w-[90%] mx-auto text-center rounded inline-block ${
                location.pathname === "/doctor" ? "bg-primary text-white" : ""
              }`}
              onClick={() => {
                setShowMenu(false);
              }}
              to="/doctor"
            >
              All Doctors
            </NavLink>
            <NavLink
              className={`px-4 py-2 w-[90%] mx-auto text-center rounded inline-block ${
                location.pathname === "/about-us" ? "bg-primary text-white" : ""
              }`}
              onClick={() => {
                setShowMenu(false);
              }}
              to="/about-us"
            >
              About Us
            </NavLink>
            <NavLink
              className={`px-4 py-2 w-[90%] mx-auto text-center rounded inline-block ${
                location.pathname === "/contact-us"
                  ? "bg-primary text-white"
                  : ""
              }`}
              onClick={() => {
                setShowMenu(false);
              }}
              to="/contact-us"
            >
              {" "}
              Contact Us
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
