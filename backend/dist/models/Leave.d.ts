import mongoose, { Document } from 'mongoose';
export interface ILeave extends Document {
    technicianId: mongoose.Types.ObjectId;
    reason: string;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}
declare const _default: mongoose.Model<ILeave, {}, {}, {}, mongoose.Document<unknown, {}, ILeave, {}, {}> & ILeave & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Leave.d.ts.map