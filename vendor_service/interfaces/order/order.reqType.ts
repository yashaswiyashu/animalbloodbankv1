import { Request } from 'express';

export interface CreateOrderRequest extends Request {
  body: {
    farmer: string;  // Farmer ID
    products: {
      product: string;  // Product ID
      quantity: number; // Quantity of the product
      price: number;    // Price of the product
    }[];  // List of products in the order
    total_amount: number; // Total order price
  };
  user?: any;  // Vendor data after authentication
}

export interface UpdateOrderRequest extends Request {
  body: {
    products: {
      product: string;  // Product ID
      quantity: number; // Quantity of the product
      price: number;    // Price of the product
    }[];  // List of products in the order
    total_amount: number;  // Total price for the order
    status?: 'pending' | 'completed' | 'cancelled';  // Optional order status update
  };
  user?: any;  // Vendor data after authentication
}

export interface GetOrderRequest extends Request {
  params: {
    orderId: string;  // Order ID
  };
  user?: any;  // Vendor data after authentication
}

export interface DeleteOrderRequest extends Request {
  params: {
    orderId: string;  // Order ID
  };
  user?: any;  // Vendor data after authentication
}