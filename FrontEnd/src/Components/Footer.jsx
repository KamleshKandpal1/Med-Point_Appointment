import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const naviagte = useNavigate();
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div className="left cursor-pointer">
          <img
            onClick={() => {
              naviagte("/");
              scrollTo(0, 0);
            }}
            className="mb-5 w-40 "
            src={assets.logo}
            alt=""
          />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            <span className="text-primary font-medium">MedPoint</span> offers a
            user-friendly platform for booking doctor appointments. Whether
            you're seeking a specialist or routine care, MedPoint connects you
            with trusted professionals in just a few clicks, ensuring quick,
            secure, and reliable healthcare management at your convenience.
          </p>
        </div>
        <div className="middle">
          <p className="text-xl font-medium mb-5 uppercase">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              onClick={() => naviagte("/")}
              className="hover:text-primary cursor-pointer"
            >
              Home
            </li>
            <li
              onClick={() => naviagte("/about-us")}
              className="hover:text-primary cursor-pointer"
            >
              About Us
            </li>
            <li
              onClick={() => naviagte("/contact-us")}
              className="hover:text-primary cursor-pointer"
            >
              Contact Us
            </li>
            <li
              onClick={() => naviagte("/")}
              className="hover:text-primary cursor-pointer"
            >
              {" "}
              Pirvacy Policy
            </li>
          </ul>
        </div>
        <div className="right">
          <p className="text-xl font-medium mb-5 uppercase">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+0-000-000-000</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="text-center">
        <hr />
        <p className="text-center py-5 text-sm font-medium">
          © 2024 MedPoint. Trusted healthcare appointments, easy and secure
          booking.
        </p>
      </div>
    </div>
  );
};

export default Footer;
