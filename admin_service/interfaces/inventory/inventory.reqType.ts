import { Request } from "express";

export interface AuthRequestInventory extends Request {
    body: {
        product_name: string;
        product_description?: string;
        price: number;
        quantity: number;
        category?: string;
    };
    user?: any;
}
