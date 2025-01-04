import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const { doctors, token, getAllDoctors, changeAvailability, deleteDoctor } =
    useContext(AdminContext);
  useEffect(() => {
    if (token) {
      getAllDoctors();
    }
  }, [token]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium *:">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 py-5 gap-y-6">
        {doctors.map((doc, index) => (
          <div
            key={index}
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
          >
            <img
              src={doc.image}
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              alt={doc.name}
            />
            <div className="p-4">
              <p className="text-xl font-medium text-neutral-800">{doc.name}</p>
              <p className="text-zinc-600 text-sm">{doc.speciality}</p>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={doc.available}
                    onChange={() => changeAvailability(doc._id)}
                  />
                  <p>Available</p>
                </div>
                <button
                  onClick={() => deleteDoctor(doc._id)}
                  className="bg-primary text-white px-2 py-0.5 text-sm rounded-lg border-primary border hover:bg-transparent hover:text-primary"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
