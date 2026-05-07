import mongoose, { Document } from 'mongoose';
export type OrderStatus = 'pending' | 'assigned' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
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
declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Order;
//# sourceMappingURL=Order.d.ts.map