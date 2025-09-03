import { Schema,model } from 'mongoose';
import { Order } from '../interfaces/order/order.interface';

const orderSchema = new Schema<Order>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    farmer: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const OrderModel = model<Order>('Order', orderSchema);

export { OrderModel };
