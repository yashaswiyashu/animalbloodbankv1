import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthRequest } from "../interfaces/user/user.reqType";
import { AuthRequestFarmer } from "../interfaces/farmer/farmer.reqType";
import Farmer from '../models/farmer.model';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from cookies
  const token = req.cookies.token; // Use cookie-parser to access cookies [[9]]
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    // Find user by ID from token
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Attach user and role to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const protectFarmer = async (
  req: AuthRequestFarmer,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from cookies
  const token = req.cookies.token; // Use cookie-parser to access cookies [[9]]
  
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    // Find user by ID from token
    const user = await Farmer.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Attach user and role to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.user_role)) {
      res.status(403).json({
        message: `Role "${req.user?.user_role}" is not allowed to access this resource`,
      });
      return;
    }
    next();
  };
};

export const authorizeRoleFarmer = (...allowedRoles: string[]) => {
  return (req: AuthRequestFarmer, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.farmer_role)) {
      res.status(403).json({
        message: `Role "${req.user?.farmer_role}" is not allowed to access this resource`,
      });
      return;
    }
    next();
  };
};
