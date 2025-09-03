import { Request } from "express";
import { IUser } from "../user/user.Interface";

export interface AuthRequest extends Request {
  user?: IUser;
}
