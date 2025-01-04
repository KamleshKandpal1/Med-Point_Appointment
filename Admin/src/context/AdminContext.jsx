import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/admin/all-doctors",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setDoctors(data.data);
        // console.log(data.data);
        // toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/admin/change-availability",
        { docId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        console.log(data);
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(error.message || "Availability Change Error");
      }
    } catch (error) {
      toast.error(error.message || "Availability Change Error");
    }
  };

  const deleteDoctor = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/admin/delete-doctor",
        { docId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        console.log(data);
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(error.message || "Availability Change Error");
      }
    } catch (error) {
      toast.error(error.message || "Availability Change Error");
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/admin/all-appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        console.log(data.data);
        setAppointments(data.data);
        // toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointmnet = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/admin/cancel-appointments",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/admin/dashboard-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setDashData(data.data);
        console.log(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    token,
    setToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    deleteDoctor,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointmnet,
    dashData,
    getDashData,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
