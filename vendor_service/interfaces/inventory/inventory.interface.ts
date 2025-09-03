import { Document, Types } from "mongoose";

export interface IInventory extends Document {
  vendor: Types.ObjectId;
  product_name: string;
  product_description?: string;
  price: number;
  quantity: number;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
