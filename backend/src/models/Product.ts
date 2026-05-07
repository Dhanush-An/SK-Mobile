import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  resolution: string;
  brand: string;
  sensorType: string;
  connectivity: string;
  price: number;
  stockQty: number;
  videoUrl?: string;
  category: string;
  galleryImages: string[];
  strategicViews: {
    front?: string;
    top?: string;
    bottom?: string;
    side?: string;
  };
  threeSixtyImages: string[];
  features: string[];
  description: string;
  storage: string;
  nightVision: string;
  weatherproofing: string;
  usageEnvironment: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  resolution: { type: String },
  brand: { type: String, default: 'SK TECH' },
  sensorType: { type: String },
  connectivity: { type: String },
  price: { type: Number, required: true },
  stockQty: { type: Number, default: 0 },
  videoUrl: { type: String },
  category: { type: String, required: true },
  galleryImages: [{ type: String }],
  strategicViews: {
    front: { type: String },
    top: { type: String },
    bottom: { type: String },
    side: { type: String },
  },
  threeSixtyImages: [{ type: String }],
  features: [{ type: String }],
  description: { type: String },
  storage: { type: String },
  nightVision: { type: String },
  weatherproofing: { type: String },
  usageEnvironment: { type: String, default: 'Outdoor' },
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
