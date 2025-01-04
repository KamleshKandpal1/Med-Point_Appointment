// import express, { urlencoded } from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );
// app.use(
//   express.json({
//     limit: "20kb",
//   })
// );
// app.use(
//   urlencoded({
//     extended: true,
//     limit: "20kb",
//   })
// );
// app.use(express.static("public"));
// app.use(cookieParser());

// // Use the admin routes
// import adminRoutes from "./routes/admin.routes.js";
// import doctorRoutes from "./routes/doctor.routes.js";
// import userRoutes from "./routes/user.routes.js";
// app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/doctor", doctorRoutes);
// app.use("/api/v1/user", userRoutes);

// export { app };
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Allowed origins from environment variables
const allowedOrigins = [
  process.env.CORS_ORIGIN_USER,
  process.env.CORS_ORIGIN_ADMIN,
];

// Configure CORS with dynamic origin
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    credentials: true, // Allow cookies
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

// Import and use routes
// import adminRoutes from "./routes/admin.routes.js";
// import doctorRoutes from "./routes/doctor.routes.js";
// import userRoutes from "./routes/user.routes.js";

// app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/doctor", doctorRoutes);
// app.use("/api/v1/user", userRoutes);

// // Use the admin routes
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/user", userRoutes);

export { app };
