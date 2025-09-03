import { Request } from "express";

export interface getOrgHospitalReq extends Request {
  body: {
    name: string;
    email: string;
    // address: string;
    city: string;
    taluk: string;
    district: string;
    state: string;
    country: string;
    pin_code: string;
    
  };
  user?: any; // if auth middleware adds farmer info to req
}