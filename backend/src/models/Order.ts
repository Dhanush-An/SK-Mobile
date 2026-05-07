import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  technicianId?: mongoose.Types.ObjectId;
  address: string;
  contactPhone: string;
  preferredDate: Date;
  preferredTime: string;
  notes?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  workProofImage?: string;
  technicianNote?: string;
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },
    technicianId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time is required'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'assigned',
        'accepted',
        'rejected',
        'in_progress',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    workProofImage: {
      type: String,
      default: '',
    },
    technicianNote: {
      type: String,
      trim: true,
      default: '',
    },
    rejectReason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
orderSchema.index({ customerId: 1, status: 1 });
orderSchema.index({ technicianId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
