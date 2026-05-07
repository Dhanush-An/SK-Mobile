import mongoose, { Document } from 'mongoose';
export interface IService extends Document {
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Service: mongoose.Model<IService, {}, {}, {}, mongoose.Document<unknown, {}, IService, {}, {}> & IService & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Service;
//# sourceMappingURL=Service.d.ts.map