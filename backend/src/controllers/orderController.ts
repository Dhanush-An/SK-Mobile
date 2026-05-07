import { Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/authMiddleware';
import { mockData, isDbConnected, saveMockData } from '../utils/mockStore';

// POST /api/orders  [Customer]
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { serviceId, address, contactPhone, preferredDate, preferredTime, notes } = req.body;

  if (!serviceId || !address || !contactPhone || !preferredDate || !preferredTime) {
    res.status(400).json({ success: false, message: 'serviceId, address, contactPhone, preferredDate and preferredTime are required' });
    return;
  }

  // Mock Mode
  if (!isDbConnected()) {
    const service = mockData.services.find((s: any) => s._id === serviceId);
    if (!service || !service.isActive) {
      res.status(404).json({ success: false, message: 'Service not found or inactive' });
      return;
    }
    const order = {
      _id: `mock_o_${Date.now()}`,
      customerId: req.user?.userId,
      serviceId: service,
      address,
      contactPhone,
      preferredDate,
      preferredTime,
      notes,
      totalAmount: service.price,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockData.orders.push(order);
    saveMockData();
    res.status(201).json({ success: true, message: 'Order created (MOCK)', data: { order } });
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

  // Mock Mode
  if (!isDbConnected()) {
    const orders = mockData.orders.filter((o: any) => o.customerId === req.user?.userId);
    if (status) {
      res.status(200).json({ success: true, data: { orders: orders.filter((o: any) => o.status === status) } });
    } else {
      res.status(200).json({ success: true, data: { orders } });
    }
    return;
  }

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

  // Mock Mode
  if (!isDbConnected()) {
    const orders = mockData.orders;
    if (status) {
      res.status(200).json({ success: true, data: { orders: orders.filter((o: any) => o.status === status) } });
    } else {
      res.status(200).json({ success: true, data: { orders } });
    }
    return;
  }

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

  // Mock Mode
  if (!isDbConnected()) {
    const orders = mockData.orders.filter((o: any) => o.technicianId === req.user?.userId);
    if (status) {
      res.status(200).json({ success: true, data: { orders: orders.filter((o: any) => o.status === status) } });
    } else {
      res.status(200).json({ success: true, data: { orders } });
    }
    return;
  }

  const orders = await Order.find(filter)
    .populate('customerId', 'name email phone')
    .populate('serviceId', 'title price category')
    .sort({ preferredDate: 1 });

  res.status(200).json({ success: true, data: { orders } });
};

// GET /api/orders/:id  [Auth]
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  // Mock Mode
  if (!isDbConnected()) {
    const order = mockData.orders.find((o: any) => o._id === req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    // Auth check
    if (req.user?.role === 'customer' && order.customerId !== req.user.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    res.status(200).json({ success: true, data: { order } });
    return;
  }

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

  // Mock Mode
  if (!isDbConnected()) {
    const technician = mockData.users.find((u: any) => u._id === technicianId && u.role === 'technician');
    if (!technician) {
      res.status(404).json({ success: false, message: 'Technician not found' });
      return;
    }
    const orderIndex = mockData.orders.findIndex((o: any) => o._id === req.params.id);
    if (orderIndex === -1) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    mockData.orders[orderIndex].technicianId = technicianId;
    mockData.orders[orderIndex].status = 'assigned';
    
    // Update technician status
    const techIndex = mockData.users.findIndex((u: any) => u._id === technicianId);
    mockData.users[techIndex].technicianStatus = 'busy';
    
    saveMockData();
    res.status(200).json({ success: true, message: 'Technician assigned (MOCK)', data: { order: mockData.orders[orderIndex] } });
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

  // Mock Mode
  if (!isDbConnected()) {
    const orderIndex = mockData.orders.findIndex((o: any) => o._id === req.params.id);
    if (orderIndex === -1) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    const order = mockData.orders[orderIndex];

    if (req.user?.role === 'technician' && order.technicianId !== req.user.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    order.status = status;
    if (technicianNote) order.technicianNote = technicianNote;
    if (rejectReason) order.rejectReason = rejectReason;
    if (workProofImage) order.workProofImage = workProofImage;

    if (['completed', 'rejected', 'cancelled'].includes(status) && order.technicianId) {
      const techIndex = mockData.users.findIndex((u: any) => u._id === order.technicianId);
      if (techIndex > -1) mockData.users[techIndex].technicianStatus = 'available';
    }
    
    saveMockData();
    res.status(200).json({ success: true, message: 'Order status updated (MOCK)', data: { order } });
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
  // Mock Mode
  if (!isDbConnected()) {
    const orderIndex = mockData.orders.findIndex((o: any) => o._id === req.params.id);
    if (orderIndex === -1) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    const order = mockData.orders[orderIndex];
    if (order.customerId !== req.user?.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    if (['completed', 'in_progress', 'cancelled'].includes(order.status)) {
      res.status(400).json({ success: false, message: `Cannot cancel an order with status: ${order.status}` });
      return;
    }
    order.status = 'cancelled';
    saveMockData();
    res.status(200).json({ success: true, message: 'Order cancelled (MOCK)', data: { order } });
    return;
  }

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
  // Mock Mode
  if (!isDbConnected()) {
    const revenue = mockData.orders.filter((o: any) => o.paymentStatus === 'paid').reduce((acc: number, o: any) => acc + o.totalAmount, 0);
    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalOrders: mockData.orders.length,
          completedOrders: mockData.orders.filter((o: any) => o.status === 'completed').length,
          pendingOrders: mockData.orders.filter((o: any) => o.status === 'pending').length,
          activeOrders: mockData.orders.filter((o: any) => ['assigned', 'accepted', 'in_progress'].includes(o.status)).length,
          revenue,
          pendingPayments: mockData.orders.filter((o: any) => o.status === 'completed' && o.paymentStatus === 'pending').length,
          totalUsers: mockData.users.length,
          totalCustomers: mockData.users.filter((u: any) => u.role === 'customer').length,
          totalTechnicians: mockData.users.filter((u: any) => u.role === 'technician').length,
        },
        monthlyRevenue: [],
      },
    });
    return;
  }

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
