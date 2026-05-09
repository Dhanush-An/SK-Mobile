import mongoose from 'mongoose';
export interface ICampaign {
    title: string;
    description: string;
    discount: string;
    voucherCode?: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<ICampaign, {}, {}, {}, mongoose.Document<unknown, {}, ICampaign, {}, {}> & ICampaign & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Campaign.d.ts.map