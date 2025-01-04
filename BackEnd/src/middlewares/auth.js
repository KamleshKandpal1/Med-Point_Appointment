import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // console.log("Cookies:", req.cookies);
    // console.log("Authorization header:", req.header("Authorization"));

    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      console.log("Extracted token is undefined or empty.");
      throw new ApiError(401, "Not Authorized. Please log in again!");
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded email matches the admin email
    if (decodeToken.email !== process.env.ADMIN_EMAIL) {
      throw new ApiError(401, "Not Authorized. Please log in again!");
    }

    req.user = decodeToken; // Attach the decoded token to `req.user` for further use

    next();
  } catch (error) {
    console.log("JWT verification error:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
