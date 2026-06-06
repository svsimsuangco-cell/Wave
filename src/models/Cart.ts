import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  planId: string;
  quantity: number;
  customizations?: {
    vCPU?: number;
    RAM?: number;
    storage?: number;
  };
  price: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        planId: String,
        quantity: Number,
        customizations: {
          vCPU: Number,
          RAM: Number,
          storage: Number,
        },
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);
