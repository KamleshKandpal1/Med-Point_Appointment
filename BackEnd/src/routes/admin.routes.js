import { Router } from "express";
import {
  addDoctor,
  adminCancelAppointment,
  adminDashboard,
  adminLogin,
  allAppointment,
  allDoctors,
} from "../controllers/admin.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.js";
import {
  changeAvailability,
  deleteDoctor,
} from "../controllers/doc.controllers.js";
const router = Router();

router.route("/login").post(adminLogin);
router.route("/add-doctor").post(verifyJWT, upload.single("image"), addDoctor);
router.route("/all-doctors").post(verifyJWT, allDoctors);
router.route("/change-availability").post(verifyJWT, changeAvailability);
router.route("/delete-doctor").post(verifyJWT, deleteDoctor);
router.route("/all-appointments").get(verifyJWT, allAppointment);
router.route("/cancel-appointments").post(verifyJWT, adminCancelAppointment);
router.route("/dashboard-data").get(verifyJWT, adminDashboard);

export default router;
