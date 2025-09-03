import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.middleware";
import { addProduct, getProducts, updateProduct, deleteProduct } from "../controllers/inventory.controller";
import {createOrder, updateOrder, getOrderById, deleteOrder, getOrdersForVendor} from '../controllers/order.controller';
const router = express.Router();

router.post("/inventory/product", protect, authorizeRoles("vendor"), addProduct);
router.get("/inventory/products", protect, authorizeRoles("vendor"), getProducts);
router.put("/inventory/product/:productId", protect, authorizeRoles("vendor"), updateProduct);
router.delete("/inventory/product/:productId", protect, authorizeRoles("vendor"), deleteProduct);

router.post('/order/add', protect, authorizeRoles("vendor"), createOrder);
router.put('/order/edit/:orderId', protect, authorizeRoles("vendor"), updateOrder);
router.delete('/order/delete/:orderId',protect, authorizeRoles("vendor"), deleteOrder);
router.get('/order/vendor-orders',protect, authorizeRoles("vendor"), getOrdersForVendor);
router.get('/order/:orderId', protect, authorizeRoles("vendor"), getOrderById);


export default router;
