import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashBoard = () => {
  const {
    doctorDashboard,
    dashdata,
    Dtoken,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  useEffect(() => {
    if (Dtoken) {
      doctorDashboard();
    }
  }, [Dtoken]);

  return (
    dashdata && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300">
            <img className="w-12" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}
                {dashdata.earning}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300">
            <img className="w-12" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashdata.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300">
            <img className="w-12" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashdata.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-2.5 p-4 mt-10 rounded-t border ">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Appointmnets</p>
          </div>

          <div className="pt-4 border border-t-0 ">
            {Array.isArray(dashdata.latestAppointments) &&
              dashdata.latestAppointments.map((item, index) => (
                <div
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                  key={index}
                >
                  <img
                    className="rounded-full w-10"
                    src={item.userData.image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">
                      {item.userData.name}
                    </p>
                    <p className="text-gray-800 font-normals">
                      Booked on {""}
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-xs font-medium text-red-500">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-xs font-medium text-green-500">
                      Completed
                    </p>
                  ) : (
                    <div className="flex gap-3">
                      <img
                        className="w-10 cursor-pointer"
                        src={assets.tick_icon}
                        alt=""
                        onClick={() => completeAppointment(item._id)}
                      />
                      <img
                        className="w-10 cursor-pointer"
                        src={assets.cancel_icon}
                        alt=""
                        onClick={() => cancelAppointment(item._id)}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashBoard;
