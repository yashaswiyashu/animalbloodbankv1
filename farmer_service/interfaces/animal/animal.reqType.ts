import { Request } from "express";

export interface AddAnimalReq extends Request {
  body: {
    type: string;
    species: string;
    breed: string;
    name: string;
    age: number;
    bloodGroup?: string;
    // location: string;
    city: string;
    taluk: string;
    district: string;
    state: string;
    country: string;
    pin_code: string;
    animalImage: string;
  };
  user?: any; // if auth middleware adds farmer info to req
}

export interface AddAnimalByAdminReq extends Request {
  body: {
    farmerId: string;
    type:string;
    species: string;
    breed: string;
    name: string;
    age: number;
    bloodGroup?: string;
    // location: string;
    city: string;
    taluk: string;
    district: string;
    state: string;
    country: string;
    pin_code: string;
    animalImage: string;
  };
}