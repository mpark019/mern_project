import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Middleware to verify JWT tokens
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID to request object
      req.user = decoded;

      next();
    } catch (error) {
      const err = new Error("Not authorized, token failed");
      err.statusCode = 401;
      throw err;
    }
  }

  // If no token found
  if (!token) {
    const error = new Error("Not authorized, no token");
    error.statusCode = 401;
    throw error;
  }
});

