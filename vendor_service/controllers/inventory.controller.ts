import { Request, Response } from "express";
import Inventory from "../models/inventory.model";
import { AuthRequestInventory } from "../interfaces/inventory/inventory.reqType";

export const addProduct = async (req: AuthRequestInventory, res: Response) => {
  try {
    const { product_name, product_description, price, quantity, category } = req.body;
    console.log(req.body);
    
    const product = await Inventory.create({
      vendor: req.user._id,
      product_name,
      product_description,
      price,
      quantity,
      category,
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req: AuthRequestInventory, res: Response) => {
  try {
    const products = await Inventory.find({ vendor: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req: AuthRequestInventory, res: Response): Promise<void>  => {
  try {
    const { productId } = req.params;

    const product = await Inventory.findOneAndUpdate(
      { _id: productId, vendor: req.user._id },
      req.body,
      { new: true }
    );

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req: AuthRequestInventory, res: Response): Promise<void>  => {
  try {
    const { productId } = req.params;

    const product = await Inventory.findOneAndDelete({ _id: productId, vendor: req.user._id });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
