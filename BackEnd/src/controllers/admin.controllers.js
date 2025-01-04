import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import docModel from "../models/doctor.model.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointment.model.js";
import userModel from "../models/user.model.js";

const addDoctor = asyncHandler(async (req, res) => {
  // take input from frontend
  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    available,
    fees,
    address,
  } = req.body;

  if (
    [
      name,
      email,
      password,
      degree,
      experience,
      about,
      available,
      fees,
      address,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Please enter a strong password");
  }
  //   check for duplictaes
  const existedDoctor = await docModel.findOne({
    email,
  });
  if (existedDoctor) {
    throw new ApiError(409, "Doctor with this email already exists");
  }

  const avatarFile =
    req.file || (req.files && req.files.image && req.files.image[0]);

  if (!avatarFile || !avatarFile.path) {
    console.error(
      "Error: No valid image file path found. File data:",
      avatarFile
    );
    throw new ApiError(400, "No image file uploaded");
  }

  // console.log("Avatar file path:", avatarFile.path);

  const avatar = await uploadOnCloudinary(avatarFile.path);

  if (!avatar) {
    // console.error("Error: Failed to upload image to Cloudinary.");
    throw new ApiError(500, "Image is not uploaded in Cloudinary");
  }

  //   create entry in db
  const docData = await docModel.create({
    name,
    email,
    image: avatar.secure_url,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address: JSON.parse(address),
    date: Date.now(),
  });

  // hide password and refreshToken
  const createdDoc = await docModel.findById(docData._id).select("_password");

  if (!createdDoc) {
    throw new ApiError(500, "Something went wrong while providing Doctor Data");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, addDoctor, "Doctor data is created"));
});

// Admin Login

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(404, "Invalid Credentials");
  } else {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "30days",
    });
    // console.log(token);
    return res
      .status(201)
      .json(new ApiResponse(201, token, "Admin login successful"));
  }
});

// Api to get all docotr list for admin panel
const allDoctors = asyncHandler(async (req, res) => {
  const doctors = await docModel.find({}).select("-password");

  // if (doctors.length === 0) {
  //   return res.status(404).json(new ApiResponse(404, [], "No doctors found"));
  // }

  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
});

const allAppointment = asyncHandler(async (req, res) => {
  const appointmnets = await appointmentModel.find({});
  if (!appointmnets) {
    res.json(new ApiResponse(404, {}, "Appointmnets data not found"));
    throw new ApiError(404, "Appointmnets data not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(202, appointmnets, "Appointmnet data fetched"));
});

const adminCancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  const appointmentData = await appointmentModel.findById(appointmentId);
  // console.log(userAppointment);

  if (!appointmentData) {
    res.json(new ApiResponse(404, {}, "Appointment Data not found"));
    throw new ApiError(404, "Appointment Data not found");
  }

  const cancelledAppointment = await appointmentModel.findByIdAndUpdate(
    appointmentId,
    { cancelled: true }
  );

  if (!cancelledAppointment) {
    res.json(new ApiResponse(400, {}, "Appointmnet cancle error"));
    throw new ApiError(400, "Appointmnet cancle error");
  }

  // releasing doctor slot
  const { docId, slotDate, slotTime } = appointmentData;

  const docData = await doctorModel.findById(docId);
  if (!docData) {
    res.json(new ApiResponse(404, {}, "Doctor Data not found"));
    throw new ApiError(404, "Doctor Data not found");
  }
  let slots_booked = docData.slots_booked;

  slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);

  await doctorModel.findByIdAndUpdate(docId, { slots_booked });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, " Appointment Cancelled"));
});

const adminDashboard = asyncHandler(async (req, res) => {
  const doctors = await docModel.find({});
  const users = await userModel.find({});
  const appointment = await appointmentModel.find({});

  const dashData = {
    doctors: doctors.length,
    appointment: appointment.length,
    patients: users.length,
    latestAppointments: appointment.reverse().slice(0, 5),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashData, "Dash data fetched"));
});

export {
  addDoctor,
  adminLogin,
  allDoctors,
  allAppointment,
  adminCancelAppointment,
  adminDashboard,
};
