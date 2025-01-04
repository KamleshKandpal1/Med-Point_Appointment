import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("address", JSON.stringify(userData.address));
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/v1/user/update-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="mt-5 flex md:flex-row flex-col gap-5 h-full">
        <div className="left w-1/2 flex gap-5 h-full">
          {isEdit ? (
            <label htmlFor="image">
              <div className="inline-block relative cursor-pointer">
                <img
                  className="w-36 rounded opacity-75"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <img
                  className="w-10 absolute bottom-12 right-12"
                  src={image ? "" : assets.upload_icon}
                  alt=""
                />
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img src={userData.image} className="w-36" alt="" />
          )}
        </div>

        <div className="right min-[991px]:w-1/2 w-full h-full">
          {isEdit ? (
            <input
              type="text"
              name=""
              id=""
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <h2 className="text-2xl font-medium text-gray-800">
              {userData.name}
            </h2>
          )}
          <div className="w-full h-0.5 bg-gray-300 mt-2 mb-4"></div>
          <p className="text-gray-400 font-normal underline underline-offset-2 uppercase">
            Contact Information
          </p>
          <div className="flex items-center gap-10 my-3">
            <div className="grid grid-cols-[1fr_3fr] gap-4 mt-3 text-neutral-700">
              <p className="font-normal">Email Id:</p>
              <p className="font-normal text-blue-500">{userData.email} </p>
              <p className="font-normal">Phone:</p>
              {isEdit ? (
                <input
                  type="tel"
                  name=""
                  id=""
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="font-normal text-blue-500">{userData.phone}</p>
              )}
              <p className="font-normal">Address:</p>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <br />
                  <input
                    type="text"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </>
              ) : (
                <p className="font-normal flex flex-col gap-1">
                  {userData?.address?.line1 || "Address line 1 not available"}
                  <br />
                  {userData?.address?.line2 || "Address line 2 not available"}
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-400 font-normal underline underline-offset-2 uppercase">
            Basic Information
          </p>
          <div className="flex items-center gap-10 my-3">
            <div className="grid grid-cols-[1fr_3fr] gap-4 mt-3 text-neutral-700">
              <p className="font-normal text-[#4B5563]">Gender:</p>
              {isEdit ? (
                <select
                  name=""
                  id=""
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="font-normal text-blue-500">{userData.gender}</p>
              )}
              <p className="font-normal text-[#4B5563]">Birthday:</p>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
              ) : (
                <p className="font-normal text-[#4B5563]">{userData.dob}</p>
              )}
            </div>
          </div>
          <div className="flex mt-6 gap-6">
            {isEdit ? (
              <button
                className="text-sm font-normal text-gray-600 px-6 py-2 border border-gray-700 rounded-full"
                onClick={updateUserProfileData}
              >
                Save Information
              </button>
            ) : (
              <button
                className="text-sm font-normal text-gray-600 px-6 py-2 border border-gray-700 rounded-full"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
