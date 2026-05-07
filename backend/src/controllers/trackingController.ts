import { Request, Response } from 'express';
import Tracking from '../models/Tracking';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';
import { isDbConnected, mockData, saveMockData } from '../utils/mockStore';

export const trackingController = {
  updateLocation: async (req: AuthRequest, res: Response) => {
    try {
      const { latitude, longitude, orderId } = req.body;
      const technicianId = req.user?.userId;

      if (!isDbConnected()) {
        mockData.tracking = mockData.tracking || {};
        mockData.tracking[technicianId!] = {
          technicianId,
          orderId,
          latitude,
          longitude,
          updatedAt: new Date()
        };
        saveMockData();
        return res.json({ success: true });
      }

      const tracking = await Tracking.findOneAndUpdate(
        { technicianId },
        { latitude, longitude, orderId, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      res.json({ success: true, data: tracking });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getTechnicianLocation: async (req: Request, res: Response) => {
    try {
      const { technicianId } = req.params;

      if (!isDbConnected()) {
        const data = mockData.tracking?.[technicianId];
        if (!data) return res.status(404).json({ success: false, message: 'Location not found' });
        return res.json({ success: true, data });
      }

      const tracking = await Tracking.findOne({ technicianId });
      if (!tracking) {
        return res.status(404).json({ success: false, message: 'Location not found' });
      }

      res.json({ success: true, data: tracking });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getAllActiveTracking: async (req: Request, res: Response) => {
    try {
      if (!isDbConnected()) {
        const trackingList = Object.values(mockData.tracking || {}).map((t: any) => {
          const user = mockData.users.find((u: any) => u._id === t.technicianId);
          return { ...t, technicianId: { _id: t.technicianId, name: user?.name } };
        });
        return res.json({ success: true, data: trackingList });
      }

      const tracking = await Tracking.find().populate('technicianId', 'name');
      res.json({ success: true, data: tracking });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
