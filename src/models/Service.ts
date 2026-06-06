import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: String,
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);
