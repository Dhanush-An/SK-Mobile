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

const campaignSchema = new mongoose.Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  discount: { type: String, required: true },
  voucherCode: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICampaign>('Campaign', campaignSchema);
