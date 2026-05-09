import { Request, Response } from 'express';
import Leave from '../models/Leave';
import { AuthRequest } from '../middleware/authMiddleware';


export const leaveController = {
  apply: async (req: AuthRequest, res: Response) => {
    try {
      const { reason, startDate, endDate } = req.body;
      const technicianId = req.user?.userId;


      const leave = new Leave({
        technicianId,
        reason,
        startDate,
        endDate
      });

      await leave.save();

      // Notify admin (using a fixed admin ID or finding one - for demo we'll skip finding and just assume notification list is filtered)
      // Or we can just skip notifications for real DB if it's not well defined yet.
      
      res.status(201).json({ success: true, data: leave });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const isAdmin = req.user?.role === 'admin';
      const userId = req.user?.userId;


      let query = {};
      if (!isAdmin) {
        query = { technicianId: userId };
      }

      const leaves = await Leave.find(query).populate('technicianId', 'name email').sort({ createdAt: -1 });
      res.json({ success: true, data: leaves });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  updateStatus: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }


      const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
      if (!leave) {
        return res.status(404).json({ success: false, message: 'Leave request not found' });
      }

      res.json({ success: true, data: leave });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
