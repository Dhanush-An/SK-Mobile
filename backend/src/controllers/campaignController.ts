import { Request, Response } from 'express';
import Campaign from '../models/Campaign';



export const campaignController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const campaigns = await Campaign.find({ isActive: true }).sort({ createdAt: -1 });
      res.json({ success: true, data: campaigns });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { title, description, discount, voucherCode, image } = req.body;
      

      const campaign = await Campaign.create({
        title,
        description,
        discount,
        voucherCode,
        image,
      });
      res.json({ success: true, data: campaign });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Campaign.findByIdAndDelete(id);
      res.json({ success: true, message: 'Campaign deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};
