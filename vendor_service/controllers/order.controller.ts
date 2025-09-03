import { Response } from "express";
import { CreateOrderRequest, DeleteOrderRequest, GetOrderRequest, UpdateOrderRequest } from "../interfaces/order/order.reqType";

import {OrderModel} from '../models/order.model';

// ✅ Add New Order
export const createOrder = async (req: CreateOrderRequest, res: Response) => {
  try {
    const vendorId = req.user._id;
    const { farmer, products, total_amount } = req.body;

    const order = new OrderModel({
      vendor: vendorId,
      farmer,
      products,
      total_amount
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ✅ Edit Order
export const updateOrder = async (req: UpdateOrderRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { products, total_amount, status } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        products,
        total_amount,
        status
      },
      { new: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ error: 'Order not found' });
        return;
    }

    res.status(200).json({ message: 'Order updated successfully', updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// ✅ Delete Order
export const deleteOrder = async (req: DeleteOrderRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      res.status(404).json({ error: 'Order not found' });
        return;
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// ✅ Get All Orders for a Vendor
export const getOrdersForVendor = async (req: GetOrderRequest, res: Response) => {
  try {
    console.log(req.user);
    
    const vendorId = req.user._id;

    const orders = await OrderModel.find({ vendor: vendorId })
      .populate('products.product')
      .populate('farmer');

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ✅ Get Single Order by ID
export const getOrderById = async (req: GetOrderRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId)
      .populate('products.product')
      .populate('farmer');

    if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
    }

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};