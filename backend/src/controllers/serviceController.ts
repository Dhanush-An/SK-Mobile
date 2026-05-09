import { Request, Response } from 'express';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/authMiddleware';


// POST /api/services  [Admin]
export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, price, category, image } = req.body;

  if (!title || !description || !price || !category) {
    res.status(400).json({ success: false, message: 'title, description, price and category are required' });
    return;
  }

  const service = await Service.create({ title, description, price, category, image });
  res.status(201).json({ success: true, message: 'Service created', data: { service } });
};

// GET /api/services  [Public]
export const getServices = async (req: Request, res: Response): Promise<void> => {
  const filter: Record<string, unknown> = {};
  // Public sees only active; admin can see all via ?all=true
  if (req.query.all !== 'true') filter.isActive = true;


  const services = await Service.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { services } });
};

// GET /api/services/:id  [Public]
export const getServiceById = async (req: Request, res: Response): Promise<void> => {

  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404).json({ success: false, message: 'Service not found' });
    return;
  }
  res.status(200).json({ success: true, data: { service } });
};

// PUT /api/services/:id  [Admin]
export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    res.status(404).json({ success: false, message: 'Service not found' });
    return;
  }

  res.status(200).json({ success: true, message: 'Service updated', data: { service } });
};

// DELETE /api/services/:id  [Admin]
export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404).json({ success: false, message: 'Service not found' });
    return;
  }
  res.status(200).json({ success: true, message: 'Service deleted' });
};
