import { Request } from "express";

export interface UpdateAnimalReq extends Request {
  body: {
    species?: string;
    breed?: string;
    age?: number;
    bloodGroup?: string;
    // location?: string;
    city?: string;
    taluk?: string;
    district?: string;
    state?: string;
    country?: string;
    pin_code?: string;
  };
  user?: any;
}
