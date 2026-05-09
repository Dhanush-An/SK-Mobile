import { Request, Response } from 'express';
import Tracking from '../models/Tracking';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';



export const trackingController = {
  updateLocation: async (req: AuthRequest, res: Response) => {
    try {
      const { latitude, longitude, orderId } = req.body;
      const technicianId = req.user?.userId;


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

      const tracking = await Tracking.find().populate('technicianId', 'name');
      res.json({ success: true, data: tracking });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
