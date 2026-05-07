import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import { isDbConnected, mockData, saveMockData } from '../utils/mockStore';

export const campaignController = {
  getAll: async (req: Request, res: Response) => {
    try {
      if (!isDbConnected()) {
        return res.json({ success: true, data: mockData.campaigns || [] });
      }
      const campaigns = await Campaign.find({ isActive: true }).sort({ createdAt: -1 });
      res.json({ success: true, data: campaigns });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { title, description, discount, voucherCode, image } = req.body;
      
      if (!isDbConnected()) {
        const newCampaign = {
          _id: 'mock_c' + Date.now(),
          title,
          description,
          discount,
          voucherCode,
          image,
          isActive: true,
          createdAt: new Date()
        };
        if (!mockData.campaigns) mockData.campaigns = [];
        mockData.campaigns.unshift(newCampaign);
        saveMockData();
        return res.json({ success: true, data: newCampaign });
      }

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
      if (!isDbConnected()) {
        mockData.campaigns = mockData.campaigns.filter((c: any) => c._id !== id);
        saveMockData();
        return res.json({ success: true, message: 'Campaign deleted' });
      }
      await Campaign.findByIdAndDelete(id);
      res.json({ success: true, message: 'Campaign deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};
