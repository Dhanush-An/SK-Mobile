import { Request, Response } from 'express';
import Leave from '../models/Leave';
import { AuthRequest } from '../middleware/authMiddleware';
import { isDbConnected, mockData, saveMockData } from '../utils/mockStore';

export const leaveController = {
  apply: async (req: AuthRequest, res: Response) => {
    try {
      const { reason, startDate, endDate } = req.body;
      const technicianId = req.user?.userId;

      if (!isDbConnected()) {
        const newLeave = {
          _id: `mock_leave_${Date.now()}`,
          technicianId,
          reason,
          startDate,
          endDate,
          status: 'pending',
          createdAt: new Date()
        };
        mockData.leaves = mockData.leaves || [];
        mockData.leaves.push(newLeave);
        
        // Notify admin
        mockData.notifications.push({
          _id: `mock_notif_${Date.now()}`,
          userId: 'mock_admin',
          title: 'New Leave Request',
          message: `A technician has applied for leave.`,
          type: 'leave',
          isRead: false,
          createdAt: new Date()
        });
        
        saveMockData();
        return res.status(201).json({ success: true, data: newLeave });
      }

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

      if (!isDbConnected()) {
        let leaves = (mockData.leaves || []).map((l: any) => {
          const user = mockData.users.find((u: any) => u._id === l.technicianId);
          return { ...l, technicianId: { _id: l.technicianId, name: user?.name, email: user?.email } };
        });

        if (!isAdmin) {
          leaves = leaves.filter((l: any) => l.technicianId?._id === userId || l.technicianId === userId);
        }

        return res.json({ success: true, data: leaves.sort((a: any, b: any) => b.createdAt - a.createdAt) });
      }

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

      if (!isDbConnected()) {
        const index = mockData.leaves.findIndex((l: any) => l._id === id);
        if (index === -1) return res.status(404).json({ success: false, message: 'Not found' });
        
        mockData.leaves[index].status = status;
        
        // Notify tech
        mockData.notifications.push({
          _id: `mock_notif_${Date.now()}`,
          userId: mockData.leaves[index].technicianId,
          title: `Leave ${status.toUpperCase()}`,
          message: `Your leave request has been ${status}.`,
          type: 'leave',
          isRead: false,
          createdAt: new Date()
        });
        
        saveMockData();
        return res.json({ success: true, data: mockData.leaves[index] });
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
