import React, { useContext } from "react";
import Login from "./Pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import { AddDoctor, AllApointments, Dashboard, DoctorList } from "./Pages";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashBoard from "./Pages/Doctor/DoctorDashBoard";
import DoctorAppointmnet from "./Pages/Doctor/DoctorAppointmnet";
import DoctorProfile from "./Pages/Doctor/DoctorProfile";

const App = () => {
  const { token } = useContext(AdminContext);
  const { Dtoken } = useContext(DoctorContext);
  return token || Dtoken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllApointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashBoard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointmnet />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <div>
        <Login />
        <ToastContainer />
      </div>
    </>
  );
};

export default App;
