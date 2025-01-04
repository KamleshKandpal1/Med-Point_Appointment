import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import userModel from "../models/user.model.js";
import doctorModel from "../models/doctor.model.js";
import appointmentModel from "../models/appointment.model.js";
import razerpay from "razorpay";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.json(new ApiResponse(400, {}, "All Fields are required"));
    throw new ApiError(400, "All Fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Please enter a strong password");
  }
  const userData = await userModel.create({
    name,
    email,
    password,
  });

  if (!userData) {
    throw new ApiError(500, "Something went wrong while creating User Data");
  }
  const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
    expiresIn: "30days",
  });
  // console.log(token);
  return res
    .status(201)
    .json(new ApiResponse(201, userData, "User data is created"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json(new ApiResponse(400, {}, "Email and Password is required"));
    throw new ApiError(400, "Email is required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    res.json(new ApiResponse(404, {}, "User is not found"));
    throw new ApiError(404, "User is not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (isPasswordValid) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json(new ApiResponse(200, token, "User Loged-In"));
  } else {
    res.status(401).json(new ApiResponse(401, {}, "Invalid password"));
    throw new ApiError(401, "Invalid password");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const userData = await userModel.findById(userId).select("-password");

  if (!userData) {
    // res.json(new ApiResponse(404, {}, "User Data not found"));
    throw new ApiError(404, "User Data not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userData, "User Data Founded"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { userId, name, phone, address, dob, gender } = req.body;
  const imageFile = req.file;

  // console.log("Request Body:", req.body);
  // console.log("Name:", name);
  // console.log("Phone:", phone);
  // console.log("DOB:", dob);
  // console.log("Gender:", gender);
  // console.log("Image File:", imageFile);

  // Validation: Check for missing fields
  if (!name || !phone || !dob || !gender) {
    res.json(new ApiResponse(400, {}, "Data Missing"));
    throw new ApiError(400, "Data Missing");
  }

  // Check if image is provided
  let avatar;
  if (imageFile) {
    try {
      avatar = await uploadOnCloudinary(imageFile.path);
    } catch (error) {
      res.json(new ApiResponse(500, {}, "Image upload failed"));
      throw new ApiError(500, "Image upload failed");
    }
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    {
      name,
      phone,
      address: JSON.parse(address || "{}"), // Default to empty object if not provided
      dob,
      gender,
      image: avatar ? avatar.secure_url : undefined, // Set image URL if avatar exists
    },
    { new: true } // Ensure the updated document is returned
  );

  // console.log("Updated User:", updatedUser);

  if (!updatedUser) {
    res.json(new ApiResponse(502, {}, "User not updated"));
    throw new ApiError(502, "User not updated");
  }

  return res.status(200).json(new ApiResponse(200, {}, "User Profile Updated"));
});

const bookAppointment = asyncHandler(async (req, res) => {
  const { userId, docId, slotDate, slotTime } = req.body;

  const docData = await doctorModel.findById(docId).select("-password");

  if (!docData) {
    res.json(new ApiResponse(404, {}, "Doctor not found"));
    throw new ApiError(404, "Doctor not found");
  }

  if (!docData.available) {
    res.json(new ApiResponse(400, {}, "Doctor not available"));
  }

  let slots_booked = docData.slots_booked;

  if (slots_booked[slotDate]) {
    if (slots_booked[slotDate].includes(slotTime)) {
      res.json(new ApiResponse(404, {}, "Slot not available"));
      throw new ApiError(404, "Slot not available");
    } else {
      slots_booked[slotDate].push(slotTime);
    }
  } else {
    slots_booked[slotDate] = [];
    slots_booked[slotDate].push(slotTime);
  }

  const userData = await userModel.findById(userId).select("-password");
  if (!userData) {
    res.json(new ApiResponse(404, {}, "User not found"));
    throw new ApiError(404, "User not found");
  }

  delete docData.slots_booked;
  // const { slots_booked: _, ...updateDocData } = docData.toObject();

  const appointmentData = new appointmentModel({
    userId,
    docId,
    userData,
    docData,
    amount: docData.fees,
    slotDate,
    slotTime,
    date: Date.now(),
  });
  await appointmentData.save();

  if (!appointmentData) {
    res.json(new ApiResponse(500, {}, "Appointment not created"));
    throw new ApiError(500, "Appointment not created");
  }

  // save new slots data in docData
  await doctorModel.findByIdAndUpdate(docId, { slots_booked });

  return res
    .status(200)
    .json(new ApiResponse(200, appointmentData, "Appointment created"));
});

const appointmentList = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // console.log(userId);

  const userAppointment = await appointmentModel.find({ userId });
  // console.log(userAppointment);

  if (!userAppointment) {
    res.json(new ApiResponse(404, {}, "User Appointment Data not found"));
    throw new ApiError(404, "User Appointment Data not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userAppointment, "User Appointment Data Founded")
    );
});

const cancleAppointment = asyncHandler(async (req, res) => {
  const { userId, appointmentId } = req.body;
  console.log(userId, appointmentId);

  const appointmentData = await appointmentModel.findById(appointmentId);
  // console.log(userAppointment);

  if (!appointmentData) {
    res.json(new ApiResponse(404, {}, "Appointment Data not found"));
    throw new ApiError(404, "Appointment Data not found");
  }

  if (appointmentData.userId !== userId) {
    res.json(new ApiResponse(404, {}, "Unauthorized action"));
    throw new ApiError(404, "Unauthorized action");
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

const razorpayInstance = new razerpay({
  key_id: process.env.RAZOROAY_KEY_ID,
  key_secret: process.env.RAZOROAY_KEY_SECRET,
});

const appointmentRazorPay = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData) {
    res.json(new ApiResponse(404, {}, "Appointment is not found"));
    throw new ApiError(404, "Appointmnet is not found");
  }
  if (!appointmentData || appointmentData.cancelled) {
    res.json(new ApiResponse(403, {}, "Appointment Cancelled or not found"));
  }

  const options = {
    amount: appointmentData.amount * 50,
    currency: process.env.CURRENCY,
    receipt: appointmentId,
  };

  const order = await razorpayInstance.orders.create(options);

  if (!order) {
    res.json(new ApiResponse(402, {}, "Appointment payment not found"));
    throw new ApiError(402, "Appointment payment not found");
  }
  return res
    .status(202)
    .json(new ApiResponse(202, order, "Appointmnet payment done!"));
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id } = req.body;

  try {
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    // console.log("Order Info:", orderInfo); // Debug information

    if (!orderInfo) {
      return res.status(404).json(new ApiResponse(404, {}, "Order not Found"));
    }

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      return res
        .status(202)
        .json(new ApiResponse(202, {}, "Payment Successful"));
    } else {
      return res.status(400).json(new ApiResponse(400, {}, "Payment Failed"));
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
});

export {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
  bookAppointment,
  appointmentList,
  cancleAppointment,
  appointmentRazorPay,
  verifyPayment,
};
