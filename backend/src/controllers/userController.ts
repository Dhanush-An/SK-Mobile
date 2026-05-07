import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { mockData, isDbConnected } from '../utils/mockStore';

// GET /api/users  [Admin]
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { role } = req.query;
  const filter: Record<string, string> = {};
  if (role && typeof role === 'string') filter.role = role;

  // Mock Mode
  if (!isDbConnected()) {
    const users = mockData.users.filter((u: any) => !role || u.role === role);
    res.status(200).json({ success: true, data: { users } });
    return;
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { users } });
};

// GET /api/users/:id  [Admin]
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  // Mock Mode
  if (!isDbConnected()) {
    const user = mockData.users.find((u: any) => u._id === req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: { user } });
    return;
  }

  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.status(200).json({ success: true, data: { user } });
};

// PUT /api/users/:id/role  [Admin]
export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  const { role } = req.body;
  const allowedRoles = ['admin', 'technician', 'customer'];

  if (!role || !allowedRoles.includes(role)) {
    res.status(400).json({ success: false, message: 'Invalid role' });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.status(200).json({ success: true, message: 'User role updated', data: { user } });
};

// PUT /api/users/:id/status  [Admin]
export const updateUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  ).select('-password');

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'}`,
    data: { user },
  });
};

// PUT /api/users/technician/status  [Technician]
export const updateTechnicianStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { technicianStatus } = req.body;
  const allowed = ['available', 'busy', 'offline'];

  if (!technicianStatus || !allowed.includes(technicianStatus)) {
    res.status(400).json({ success: false, message: 'Invalid technician status' });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { technicianStatus },
    { new: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'Availability updated',
    data: { user },
  });
};
