import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';


// Internal utility to create notifications
export const createNotificationInternal = async (userId: string, title: string, message: string, type: string) => {
  return await Notification.create({ userId, title, message, type });
};

// GET /api/notifications
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    const notifications = await Notification.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
