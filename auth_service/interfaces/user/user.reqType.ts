import { Request } from "express";
import { IUser } from "./user.Interface";

export interface AuthRequest extends Request {
  user?: IUser;
}
