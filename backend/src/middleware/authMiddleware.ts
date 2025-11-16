import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

interface JwtPayload {
  userId: string;
  id?: string;
}

interface CustomError extends Error {
  statusCode?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware to verify JWT tokens
export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Attach user ID to request object
      req.user = decoded;

      next();
    } catch (error) {
      const err = new Error("Not authorized, token failed") as CustomError;
      err.statusCode = 401;
      throw err;
    }
  }

  // If no token found
  if (!token) {
    const error = new Error("Not authorized, no token") as CustomError;
    error.statusCode = 401;
    throw error;
  }
});

