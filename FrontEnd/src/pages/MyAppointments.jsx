import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol, getDoctorsData } =
    useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const naviagte = useNavigate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("-");
    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1] - 1)] +
      "," +
      " " +
      dateArray[2]
    );
  };
  const getUsersAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/v1/user/appointments-list",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        // console.log(data.data);
        setAppointments(data.data.reverse());
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
        backendUrl + "/api/v1/user/cancel-appointments",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getUsersAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointmnet Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/v1/user/payment-verification",
            response,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (data.success) {
            getUsersAppointments();
            naviagte("/my-appointment");
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
        // console.log(response);
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    console.log(order);
  };

  const appointmentPayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/v1/user/appointment-payment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        // console.log(data.data);
        initPay(data.data);
        // toast.success(data.message);
        // getUsersAppointments();
        // getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUsersAppointments();
    }
  }, [token]);

  return (
    <div className="mt-5">
      <p className="text-gray-500 font-normal">My Appointments</p>
      <div className="flex flex-col gap-3 my-4">
        <div className="h-[1px] w-full bg-neutral-200"></div>
        {appointments.map((item, _) => (
          <div className="flex flex-col gap-4" key={item._id}>
            <div className="flex md:flex-row flex-col gap-6 w-full">
              <div className="flex gap-3 sm:w-4/6 w-full items-center">
                <img
                  src={item.docData.image}
                  className="w-36 bg-blue-100"
                  alt={item.name}
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.docData.name}</p>
                  <p className="font-normal text-sm text-gray-600">
                    {item.docData.speciality}
                  </p>
                  <p className="font-medium my-1 text-xs text-gray-600">
                    Address:
                  </p>
                  <p className="font-normal text-xs text-gray-600">
                    {item.docData.address.line1}
                  </p>
                  <p className="font-normal text-xs text-gray-600">
                    {item.docData.address.line2}
                  </p>
                  <p className="font-normal mt-1 text-xs text-gray-600">
                    <span className="font-semibold">Date & Time:</span>{" "}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                  <p className="font-normal mt-1 text-xs text-gray-600">
                    <span className="font-semibold">Fee:</span> {currencySymbol}
                    {item.amount}
                  </p>
                </div>
              </div>
              <div className="flex  sm:items-center justify-between sm:w-2/6 w-full">
                <div className="flex flex-col gap-3 w-full sm:items-end">
                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <button
                      className="py-2 text-sm text-stone-500 bg-indigo-50 w-1/2 font-normal border rounded"
                      onClick={() => appointmentPayment(item._id)}
                    >
                      Paid
                    </button>
                  )}
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <button
                      className="py-2 text-sm text-stone-500 w-1/2 font-normal border hover:text-white hover:bg-primary transition-all duration-500"
                      onClick={() => appointmentPayment(item._id)}
                    >
                      Pay here
                    </button>
                  )}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      className="py-2 text-sm text-stone-500 w-1/2 font-normal border hover:text-white hover:bg-red-500 transition-all duration-500"
                      onClick={() => cancelAppointment(item._id)}
                    >
                      Cancel appointment
                    </button>
                  )}
                  {item.cancelled && !item.isCompleted && (
                    <button className="py-2 w-1/2 text-sm border border-red-500 rounded text-red-500">
                      Appointment Cancelled
                    </button>
                  )}
                  {item.isCompleted && (
                    <button className="py-2 text-sm text-green-500 w-1/2 font-normal border rounded border-green-500">
                      Appointment Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
