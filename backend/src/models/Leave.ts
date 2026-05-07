import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  technicianId: mongoose.Types.ObjectId;
  reason: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const LeaveSchema: Schema = new Schema({
  technicianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILeave>('Leave', LeaveSchema);
