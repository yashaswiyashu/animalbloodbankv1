import { Document, Types } from "mongoose";

// Product Interface for products in the order
export interface Product {
  product: string;  // Product ID
  quantity: number; // Quantity of the product
  price: number;    // Price of the product
}

export interface Order extends Document {
  vendor: Types.ObjectId;         // Vendor ID
  farmer: Types.ObjectId;         // Farmer ID (who ordered)
  products: Product[];    // Products list in the order
  total_amount: number;   // Total price for the order
  status: 'pending' | 'completed' | 'cancelled';  // Order status
  createdAt: Date;
  updatedAt: Date;
}