import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  technicianId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: Date;
  category?: string;
  type: 'admin' | 'employee';
  receiptImage?: string;
}

const ExpenseSchema: Schema = new Schema({
  technicianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now },
  category: { type: String, default: 'General' },
  type: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  receiptImage: { type: String }
}, { timestamps: true });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
