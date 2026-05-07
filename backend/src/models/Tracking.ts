import mongoose, { Document, Schema } from 'mongoose';

export interface ITracking extends Document {
  technicianId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  latitude: number;
  longitude: number;
  updatedAt: Date;
}

const trackingSchema = new Schema<ITracking>(
  {
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tracking = mongoose.model<ITracking>('Tracking', trackingSchema);
export default Tracking;
