import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { docProfile, setDocProfile, getDoctorProfile, Dtoken, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const updateProfile = async () => {
    try {
      const updateData = {
        address: docProfile.address,
        fees: docProfile.fees,
        available: docProfile.available,
      };
      const { data } = await axios.post(
        backendUrl + "/api/v1/doctor/update-doctor-profile",
        updateData,
        {
          headers: { Authorization: `Bearer ${Dtoken}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorProfile();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (Dtoken) {
      getDoctorProfile();
    }
  }, [Dtoken]);
  return (
    docProfile && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/70 w-full sm:max-w-64 rounded-lg"
              src={docProfile.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg px-8 py-7 bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {docProfile.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p>
                {docProfile.degree} - {docProfile.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docProfile.experience}
              </button>
            </div>
            {/* about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {docProfile.about}
              </p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currency}
                {isEdit ? (
                  <input
                    className="border px-2"
                    type="number"
                    onChange={(e) =>
                      setDocProfile((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={docProfile.fees}
                  />
                ) : (
                  docProfile.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    className="border"
                    type="text"
                    onChange={(e) =>
                      setDocProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={docProfile.address.line1}
                  />
                ) : (
                  docProfile.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    className="border mt-2"
                    type="text"
                    onChange={(e) =>
                      setDocProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={docProfile.address.line2}
                  />
                ) : (
                  docProfile.address.line2
                )}
              </p>
            </div>
            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setDocProfile((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={docProfile.available}
                type="checkbox"
                className="cursor-pointer"
                name=""
                id=""
              />
              <label htmlFor="">Available</label>
            </div>
            {isEdit ? (
              <button
                className="px-4 py-1 border mt-5 rounded-full bg-slate-200 text-slate-500
            hover:bg-primary hover:text-white transition-all"
                onClick={updateProfile}
              >
                Save Profile
              </button>
            ) : (
              <button
                className="px-4 py-1 border mt-5 rounded-full bg-slate-200 text-slate-500
            hover:bg-primary hover:text-white transition-all"
                onClick={() => setIsEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
