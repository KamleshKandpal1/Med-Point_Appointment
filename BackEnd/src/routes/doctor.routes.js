import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.js";
import {
  appointmentCancel,
  appointmentComplete,
  doctorAppointmentList,
  doctorDashboard,
  doctorList,
  doctorLogin,
  getDoctor,
  updateDoctorProfile,
} from "../controllers/doc.controllers.js";
import { verifyDoctorJWT } from "../middlewares/authDoctor.js";

const router = Router();

router.route("/list").get(doctorList);
router.route("/login").post(doctorLogin);
router
  .route("/doctor-appointments-list")
  .get(verifyDoctorJWT, doctorAppointmentList);
router
  .route("/doctor-appointments-complete")
  .post(verifyDoctorJWT, appointmentComplete);
router
  .route("/doctor-appointments-cancel")
  .post(verifyDoctorJWT, appointmentCancel);
router.route("/doctor-dashboard").get(verifyDoctorJWT, doctorDashboard);
router.route("/doctor-data").get(verifyDoctorJWT, getDoctor);
router
  .route("/update-doctor-profile")
  .post(verifyDoctorJWT, updateDoctorProfile);

export default router;
