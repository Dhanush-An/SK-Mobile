import { Request, Response } from 'express';
import Announcement from '../models/Announcement';

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, content, priority } = req.body;
    const announcement = await Announcement.create({
      title,
      content,
      priority: priority || 'NORMAL',
    });

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, message: 'Announcement deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
