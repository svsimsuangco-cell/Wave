import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  serviceId: string;
  name: string;
  description?: string;
  basePricePerMonth: number;
  vCPU: number;
  RAM: number;
  storage: number;
  bandwidth: string;
  features: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    serviceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    basePricePerMonth: {
      type: Number,
      required: true,
    },
    vCPU: {
      type: Number,
      required: true,
    },
    RAM: {
      type: Number,
      required: true,
    },
    storage: {
      type: Number,
      required: true,
    },
    bandwidth: {
      type: String,
      default: 'Unlimited',
    },
    features: [String],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', planSchema);
