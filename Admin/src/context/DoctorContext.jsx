import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [Dtoken, setDToken] = useState(
    localStorage.getItem("dtoken") ? localStorage.getItem("dtoken") : ""
  );
  const [docProfile, setDocProfile] = useState(false);
  const [appointment, setAppointment] = useState([]);
  const [dashdata, setDashdata] = useState([]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/doctor/doctor-appointments-list",
        { headers: { Authorization: `Bearer ${Dtoken}` } }
      );

      if (data.success) {
        // console.log(data);
        setAppointment(data.data.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/doctor/doctor-appointments-complete",
        { appointmentId },
        { headers: { Authorization: `Bearer ${Dtoken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/doctor/doctor-appointments-cancel",
        { appointmentId },
        { headers: { Authorization: `Bearer ${Dtoken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const doctorDashboard = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/doctor/doctor-dashboard",
        { headers: { Authorization: `Bearer ${Dtoken}` } }
      );
      if (data.success) {
        setDashdata(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDoctorProfile = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/doctor/doctor-data",
        {
          headers: { Authorization: `Bearer ${Dtoken}` },
        }
      );
      if (data.success) {
        setDocProfile(data.data);
        console.log(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    Dtoken,
    setDToken,
    backendUrl,
    appointment,
    getAppointments,
    setAppointment,
    completeAppointment,
    cancelAppointment,
    doctorDashboard,
    dashdata,
    setDashdata,
    docProfile,
    setDocProfile,
    getDoctorProfile,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};
export default DoctorContextProvider;
