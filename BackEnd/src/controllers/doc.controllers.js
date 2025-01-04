import appointmentModel from "../models/appointment.model.js";
import doctorModel from "../models/doctor.model.js";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const changeAvailability = asyncHandler(async (req, res) => {
  const { docId } = req.body;

  // Fetch the doctor's data by ID
  const docData = await doctorModel.findById(docId);
  if (!docData) {
    throw new ApiError(404, "Invalid Doctor ID");
  }

  // Toggle the availability status
  const updatedAvailability = await doctorModel.findByIdAndUpdate(
    docId,
    { available: !docData.available }, // Toggle the current availability
    { new: true } // Return the updated document
  );

  if (!updatedAvailability) {
    throw new ApiError(501, "Internal Error");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAvailability, "Availability Changed"));
});
const deleteDoctor = asyncHandler(async (req, res) => {
  const { docId } = req.body;

  // Fetch the doctor's data by ID
  const docData = await doctorModel.findById(docId);
  if (!docData) {
    throw new ApiError(404, "Invalid Doctor ID");
  }

  // Toggle the availability status
  const deleteDoctor = await doctorModel.findByIdAndDelete(docId);

  if (!deleteDoctor) {
    throw new ApiError(501, "Internal Error");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Doctor Deleted"));
});

const doctorList = asyncHandler(async (req, res) => {
  const doctors = await doctorModel.find({}).select(["-password", "-email"]);
  if (doctors.length === 0) {
    return res
      .status(204)
      .json(new ApiResponse(204, doctors, "No Doctor Data Founded"));
  }
  return res
    .status(202)
    .json(new ApiResponse(202, doctors, "Doctor Data Founded"));
});

const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    res.json(new ApiResponse(400, {}, "All fields are required"));
    throw new ApiError(400, "All fields are required");
  }

  const doctor = await doctorModel.findOne({ email });
  if (!doctor) {
    res.json(new ApiResponse(404, {}, "Enter valid credentials"));
    throw new ApiError(404, "Enter valid credentials");
  }
  const isPasswordValid = await doctor.isPasswordCorrect(password);
  if (isPasswordValid) {
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    return res.status(200).json(new ApiResponse(200, token, "Doctor Loged-In"));
  } else {
    res.status(401).json(new ApiResponse(401, {}, "Invalid password"));
    throw new ApiError(401, "Invalid password");
  }
});

const doctorAppointmentList = asyncHandler(async (req, res) => {
  const { docId } = req.body;
  // console.log(userId);

  const DoctorAppointment = await appointmentModel.find({ docId });
  // console.log(userAppointment);

  if (!DoctorAppointment) {
    res.json(new ApiResponse(404, {}, "Doctor Appointment Data not found"));
    throw new ApiError(404, "Doctor Appointment Data not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, DoctorAppointment, "Doctor Appointment Data Founded")
    );
});

const appointmentComplete = asyncHandler(async (req, res) => {
  const { docId, appointmentId } = req.body;
  // console.log("docId", docId);
  // console.log("appointmentId", appointmentId);

  const appointmentData = await appointmentModel.findById(appointmentId);
  // console.log(appointmentData);

  if (!appointmentData) {
    res.json(new ApiResponse(404, {}, "Appointment Data not found"));
    throw new ApiError(404, "Appointment Data not found");
  }

  if (appointmentData && appointmentData.docId === docId) {
    const appointmentCompleted = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true }
    );
    res.json(
      new ApiResponse(200, appointmentCompleted, "Appointment Completed")
    );
  } else {
    res.json(new ApiResponse(400, {}, "Appointment Marked Failed"));
    throw new ApiError(400, "Appointment Marked Failed");
  }
});

const appointmentCancel = asyncHandler(async (req, res) => {
  const { docId, appointmentId } = req.body;

  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData) {
    res.json(new ApiResponse(404, {}, "Appointment Data not found"));
    throw new ApiError(404, "Appointment Data not found");
  }

  if (appointmentData && appointmentData.docId === docId) {
    const appointmentCompleted = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true }
    );
    res.json(
      new ApiResponse(200, appointmentCompleted, "Appointment Cancelled")
    );
  } else {
    res.json(new ApiResponse(400, {}, "Appointment Cancellation Failed"));
    throw new ApiError(400, "Appointment Cancellation Failed");
  }
});

const doctorDashboard = asyncHandler(async (req, res) => {
  const { docId } = req.body;

  const appointments = await appointmentModel.find({ docId });
  if (!appointments) {
    res.json(new ApiResponse(404, {}, "Appointmnets data not found"));
    throw new ApiError(404, "Appointmnets data not found");
  }

  let earning = 0;
  let patients = [];
  appointments.map((item) => {
    if (item.isCompleted || item.payment) {
      earning += item.amount;
    }
  });
  appointments.map((item) => {
    if (!patients.includes(item.userId)) {
      patients.push(item.userId);
    }
  });
  const dashData = {
    earning,
    appointments: appointments.length,
    patients: patients.length,
    latestAppointments: appointments.reverse().slice(0, 5),
  };
  // console.log(dashData);

  return res
    .status(200)
    .json(new ApiResponse(200, dashData, "Doctor Dash data fetched"));
});

const getDoctor = asyncHandler(async (req, res) => {
  const { docId } = req.body;
  // console.log(docId);

  const docData = await doctorModel
    .findById(docId)
    .select("-password, -slots_booked");

  if (!docData) {
    res.json(new ApiResponse(404, {}, "Doctor Data not found"));
    throw new ApiError(404, "Doctor Data not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, docData, "User Data Founded"));
});

const updateDoctorProfile = asyncHandler(async (req, res) => {
  const { docId, fees, address, available } = req.body;
  if (!fees || !address) {
    res.json(new ApiResponse(400, {}, "Data Missing"));
    throw new ApiError(400, "Data Missing");
  }

  const updatedUser = await doctorModel.findByIdAndUpdate(
    docId,
    {
      fees,
      address,
      // JSON.parse(address || "{}"), // Default to empty object if not provided
      available,
    },
    { new: true } // Ensure the updated document is returned
  );

  if (!updatedUser) {
    res.json(new ApiResponse(502, {}, "Doctor not updated"));
    throw new ApiError(502, "Doctor not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Doctor Profile Updated"));
});
const updateFullDoctorProfile = asyncHandler(async (req, res) => {
  const {
    docId,
    name,
    speciality,
    education,
    experience,
    about,
    fees,
    address,
    available,
  } = req.body;
  if (
    !fees ||
    !address ||
    !name ||
    !speciality ||
    !education ||
    !experience ||
    !about
  ) {
    res.json(new ApiResponse(400, {}, "Data Missing"));
    throw new ApiError(400, "Data Missing");
  }

  const updatedUser = await doctorModel.findByIdAndUpdate(
    docId,
    {
      fees,
      address,
      // JSON.parse(address || "{}"), // Default to empty object if not provided
      available,
      name,
      speciality,
      education,
      experience,
      about,
    },
    { new: true } // Ensure the updated document is returned
  );

  if (!updatedUser) {
    res.json(new ApiResponse(502, {}, "Doctor not updated"));
    throw new ApiError(502, "Doctor not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Doctor Profile Updated"));
});
export {
  changeAvailability,
  deleteDoctor,
  doctorList,
  doctorLogin,
  doctorAppointmentList,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  getDoctor,
  updateDoctorProfile,
  updateFullDoctorProfile,
};
