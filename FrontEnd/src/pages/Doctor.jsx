import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctor = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [specName, setSpecName] = useState("");
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600 mt-6">
        Browse through the doctors specialist.
      </p>
      <div className=" flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="hidden sm:flex flex-col gap-4 text-sm text-gray-600">
          <p
            onClick={() => navigate("/doctor")}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
              !speciality ? "bg-indigo-400 text-white" : ""
            }`}
          >
            All Doctors
          </p>
          <p
            onClick={() =>
              speciality === ""
                ? navigate("/doctor")
                : navigate("/doctor/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
              speciality === "General physician"
                ? "bg-indigo-400 text-white"
                : ""
            }`}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === ""
                ? navigate("/doctor")
                : navigate("/doctor/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
              speciality === "Gynecologist" ? "bg-indigo-400 text-white" : ""
            }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === ""
                ? navigate("/doctor")
                : navigate("/doctor/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
              speciality === "Dermatologist" ? "bg-indigo-400 text-white" : ""
            }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === ""
                ? navigate("/doctor")
                : navigate("/doctor/Pediatricians")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
              speciality === "Pediatricians" ? "bg-indigo-400 text-white" : ""
            }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === ""
                ? navigate("/doctor")
                : navigate("/doctor/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
              speciality === "Neurologist" ? "bg-indigo-400 text-white" : ""
            }`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === ""
                ? navigate("/doctor")
                : navigate("/doctor/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-400 text-white"
                : ""
            }`}
          >
            Gastroenterologist
          </p>
        </div>
        <div className="block sm:hidden w-full mb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-[--green] py-2 px-4 text-left shadow-lg rounded-lg p-4 bg-gray-100 text-gray-700 hover:bg-[--green-light] hover:text-[--green-dark] hover:shadow-md font-medium"
          >
            {specName}
            <span className="float-right">{isDropdownOpen ? "▲" : "▼"}</span>
          </button>

          {isDropdownOpen && (
            <div className="mt-2 bg-white shadow-lg rounded-lg p-4">
              <ul className="flex flex-col gap-3 list-none text-sm font-medium capitalize">
                {[
                  { label: "All Doctors", path: "/doctor", value: "" },
                  {
                    label: "General physician",
                    path: "/doctor/General physician",
                    value: "General physician",
                  },
                  {
                    label: "Gynecologist",
                    path: "/doctor/Gynecologist",
                    value: "Gynecologist",
                  },
                  {
                    label: "Dermatologist",
                    path: "/doctor/Dermatologist",
                    value: "Dermatologist",
                  },
                  {
                    label: "Pediatricians",
                    path: "/doctor/Pediatricians",
                    value: "Pediatricians",
                  },
                  {
                    label: "Neurologist",
                    path: "/doctor/Neurologist",
                    value: "Neurologist",
                  },
                  {
                    label: "Gastroenterologist",
                    path: "/doctor/Gastroenterologist",
                    value: "Gastroenterologist",
                  },
                ].map((specialty) => (
                  <p
                    key={specialty.label}
                    onClick={() => {
                      navigate(specialty.path);
                      setSpecName(specialty.label);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer capitalize ${
                      speciality === specialty.value
                        ? "bg-indigo-400 text-white"
                        : ""
                    }`}
                  >
                    {specialty.label}
                  </p>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    } rounded-full `}
                  ></p>
                  <p>{item.available ? "Available" : "Not-available"}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctor;
