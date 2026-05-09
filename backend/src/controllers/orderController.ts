import { Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/authMiddleware';


// POST /api/orders  [Customer]
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { serviceId, address, contactPhone, preferredDate, preferredTime, notes } = req.body;

  if (!serviceId || !address || !contactPhone || !preferredDate || !preferredTime) {
    res.status(400).json({ success: false, message: 'serviceId, address, contactPhone, preferredDate and preferredTime are required' });
    return;
  }


  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    res.status(404).json({ success: false, message: 'Service not found or inactive' });
    return;
  }

  const order = await Order.create({
    customerId: req.user?.userId,
    serviceId,
    address,
    contactPhone,
    preferredDate,
    preferredTime,
    notes,
    totalAmount: service.price,
    status: 'pending',
    paymentStatus: 'pending',
  });

  const populated = await order.populate(['serviceId', 'customerId']);
  res.status(201).json({ success: true, message: 'Order created', data: { order: populated } });
};

// GET /api/orders/my  [Customer]
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.query;
  const filter: Record<string, unknown> = { customerId: req.user?.userId };
  if (status) filter.status = status;


  const orders = await Order.find(filter)
    .populate('serviceId', 'title price category image')
    .populate('technicianId', 'name phone')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { orders } });
};

// GET /api/orders/all  [Admin]
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, paymentStatus } = req.query;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;


  const orders = await Order.find(filter)
    .populate('customerId', 'name email phone')
    .populate('serviceId', 'title price category')
    .populate('technicianId', 'name phone email')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { orders } });
};

// GET /api/orders/assigned  [Technician]
export const getAssignedOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.query;
  const filter: Record<string, unknown> = { technicianId: req.user?.userId };
  if (status) filter.status = status;


  const orders = await Order.find(filter)
    .populate('customerId', 'name email phone')
    .populate('serviceId', 'title price category')
    .sort({ preferredDate: 1 });

  res.status(200).json({ success: true, data: { orders } });
};

// GET /api/orders/:id  [Auth]
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {

  const order = await Order.findById(req.params.id)
    .populate('customerId', 'name email phone')
    .populate('serviceId', 'title price description category image')
    .populate('technicianId', 'name phone email technicianStatus');

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  // Customers can only see their own orders
  if (req.user?.role === 'customer' && order.customerId._id.toString() !== req.user.userId) {
    res.status(403).json({ success: false, message: 'Access denied' });
    return;
  }

  // Technicians can only see assigned orders
  if (req.user?.role === 'technician' && order.technicianId?._id.toString() !== req.user.userId) {
    res.status(403).json({ success: false, message: 'Access denied' });
    return;
  }

  res.status(200).json({ success: true, data: { order } });
};

// PUT /api/orders/:id/assign  [Admin]
export const assignTechnician = async (req: AuthRequest, res: Response): Promise<void> => {
  const { technicianId } = req.body;

  if (!technicianId) {
    res.status(400).json({ success: false, message: 'technicianId is required' });
    return;
  }


  const technician = await User.findById(technicianId);
  if (!technician || technician.role !== 'technician') {
    res.status(404).json({ success: false, message: 'Technician not found' });
    return;
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { technicianId, status: 'assigned' },
    { new: true }
  )
    .populate('customerId', 'name email phone')
    .populate('serviceId', 'title price')
    .populate('technicianId', 'name phone email');

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  // Update technician status to busy
  await User.findByIdAndUpdate(technicianId, { technicianStatus: 'busy' });

  res.status(200).json({ success: true, message: 'Technician assigned', data: { order } });
};

// PUT /api/orders/:id/status  [Technician / Admin]
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, technicianNote, rejectReason, workProofImage } = req.body;

  const allowedStatuses = ['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid status' });
    return;
  }


  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  // Technician can only update their own assigned order
  if (
    req.user?.role === 'technician' &&
    order.technicianId?.toString() !== req.user.userId
  ) {
    res.status(403).json({ success: false, message: 'Access denied' });
    return;
  }

  order.status = status;
  if (technicianNote) order.technicianNote = technicianNote;
  if (rejectReason) order.rejectReason = rejectReason;
  if (workProofImage) order.workProofImage = workProofImage;

  // Free up technician if completed/rejected/cancelled
  if (['completed', 'rejected', 'cancelled'].includes(status) && order.technicianId) {
    await User.findByIdAndUpdate(order.technicianId, { technicianStatus: 'available' });
  }

  await order.save();
  const updated = await order.populate([
    { path: 'customerId', select: 'name email phone' },
    { path: 'serviceId', select: 'title price' },
    { path: 'technicianId', select: 'name phone email' },
  ]);

  res.status(200).json({ success: true, message: 'Order status updated', data: { order: updated } });
};

// PUT /api/orders/:id/cancel  [Customer]
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  if (order.customerId.toString() !== req.user?.userId) {
    res.status(403).json({ success: false, message: 'Access denied' });
    return;
  }

  if (['completed', 'in_progress', 'cancelled'].includes(order.status)) {
    res.status(400).json({ success: false, message: `Cannot cancel an order with status: ${order.status}` });
    return;
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({ success: true, message: 'Order cancelled', data: { order } });
};

// GET /api/orders/reports  [Admin]
export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {

  const [
    totalOrders,
    completedOrders,
    pendingOrders,
    activeOrders,
    totalRevenue,
    totalUsers,
    totalCustomers,
    totalTechnicians,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'completed' }),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: { $in: ['assigned', 'accepted', 'in_progress'] } }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    User.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'technician' }),
  ]);

  const revenue = totalRevenue[0]?.total || 0;

  const pendingPayments = await Order.countDocuments({
    status: 'completed',
    paymentStatus: 'pending',
  });

  // Monthly revenue breakdown (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalOrders,
        completedOrders,
        pendingOrders,
        activeOrders,
        revenue,
        pendingPayments,
        totalUsers,
        totalCustomers,
        totalTechnicians,
      },
      monthlyRevenue,
    },
  });
};
