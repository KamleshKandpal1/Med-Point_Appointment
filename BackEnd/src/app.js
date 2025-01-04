import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "20kb",
  })
);
app.use(
  urlencoded({
    extended: true,
    limit: "20kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());

// Use the admin routes
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/user", userRoutes);

export { app };

// const allowedOrigins = [
//   process.env.CORS_ORIGIN_USER,
//   process.env.CORS_ORIGIN_ADMIN,
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log("Request Origin:", origin); // Debugging
//       if (!origin || allowedOrigins.includes(origin)) {
//         // Allow undefined origins and valid origins
//         callback(null, true);
//       } else {
//         console.error("Blocked by CORS:", origin); // Log blocked origins
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow cookies
//   })
// );
