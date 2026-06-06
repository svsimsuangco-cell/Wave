import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  orderNumber: string;
  items: Array<{
    planId: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'stripe' | 'paypal';
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  paypalOrderId?: string;
  paypalPayerId?: string;
  billingInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        planId: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal'],
      default: 'stripe',
    },
    stripePaymentIntentId: String,
    stripeSessionId: String,
    paypalOrderId: String,
    paypalPayerId: String,
    billingInfo: {
      email: String,
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
