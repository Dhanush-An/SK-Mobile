import mongoose, { Document } from 'mongoose';
export interface ITracking extends Document {
    technicianId: mongoose.Types.ObjectId;
    orderId?: mongoose.Types.ObjectId;
    latitude: number;
    longitude: number;
    updatedAt: Date;
}
declare const Tracking: mongoose.Model<ITracking, {}, {}, {}, mongoose.Document<unknown, {}, ITracking, {}, {}> & ITracking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Tracking;
//# sourceMappingURL=Tracking.d.ts.map