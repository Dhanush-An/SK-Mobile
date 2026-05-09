import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map