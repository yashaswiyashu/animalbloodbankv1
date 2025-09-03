import { Request } from "express";
import { IFarmer } from "./farmer.interface";

export interface AuthRequestFarmer extends Request {
  user?: IFarmer;
}
