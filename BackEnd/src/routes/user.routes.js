import { Router } from "express";
import {
  appointmentList,
  appointmentRazorPay,
  bookAppointment,
  cancleAppointment,
  getUser,
  loginUser,
  registerUser,
  updateProfile,
  verifyPayment,
} from "../controllers/user.controllers.js";
import { verifyUserJWT } from "../middlewares/authUser.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get-profile").get(verifyUserJWT, getUser);
router
  .route("/update-profile")
  .post(upload.single("image"), verifyUserJWT, updateProfile);
router.route("/book-appointment").post(verifyUserJWT, bookAppointment);
router.route("/appointments-list").get(verifyUserJWT, appointmentList);
router.route("/cancel-appointments").post(verifyUserJWT, cancleAppointment);
router.route("/appointment-payment").post(verifyUserJWT, appointmentRazorPay);
router.route("/payment-verification").post(verifyUserJWT, verifyPayment);

export default router;
