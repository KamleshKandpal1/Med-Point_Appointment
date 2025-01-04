import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyUserJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      // console.log("Extracted token is undefined or empty.");
      throw new ApiError(401, "Not Authorized. Please log in again!");
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token payload:", decodeToken);
    req.body.userId = decodeToken.id;
    next();
  } catch (error) {
    // console.log("JWT verification error:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
