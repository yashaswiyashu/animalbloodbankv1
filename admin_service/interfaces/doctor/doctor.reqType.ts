import { Request } from "express";

export interface AddAppointmentShedule extends Request {
  user?: any; // if auth middleware adds farmer info to req
}