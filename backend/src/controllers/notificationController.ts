import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';
import { isDbConnected, mockData, saveMockData } from '../utils/mockStore';

// Internal utility to create notifications
export const createNotificationInternal = async (userId: string, title: string, message: string, type: string) => {
  if (!isDbConnected()) {
    const newNotif = {
      _id: `mock_notif_${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date()
    };
    mockData.notifications.push(newNotif);
    saveMockData();
    return newNotif;
  }
  return await Notification.create({ userId, title, message, type });
};

// GET /api/notifications
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbConnected()) {
      const data = mockData.notifications.filter((n: any) => n.userId === req.user?.userId);
      res.status(200).json({ success: true, data: data.sort((a: any, b: any) => b.createdAt - a.createdAt) });
      return;
    }

    const notifications = await Notification.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbConnected()) {
      const index = mockData.notifications.findIndex((n: any) => n._id === req.params.id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }
      mockData.notifications[index].isRead = true;
      saveMockData();
      res.status(200).json({ success: true });
      return;
    }

    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
