import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IExpense, {}, {}, {}, mongoose.Document<unknown, {}, IExpense, {}, {}> & IExpense & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Expense.d.ts.map