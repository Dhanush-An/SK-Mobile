"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = exports.cancelOrder = exports.updateOrderStatus = exports.assignTechnician = exports.getOrderById = exports.getAssignedOrders = exports.getAllOrders = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const Service_1 = __importDefault(require("../models/Service"));
const mockStore_1 = require("../utils/mockStore");
// POST /api/orders  [Customer]
const createOrder = async (req, res) => {
    const { serviceId, address, contactPhone, preferredDate, preferredTime, notes } = req.body;
    if (!serviceId || !address || !contactPhone || !preferredDate || !preferredTime) {
        res.status(400).json({ success: false, message: 'serviceId, address, contactPhone, preferredDate and preferredTime are required' });
        return;
    }
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const service = mockStore_1.mockData.services.find((s) => s._id === serviceId);
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
        mockStore_1.mockData.orders.push(order);
        (0, mockStore_1.saveMockData)();
        res.status(201).json({ success: true, message: 'Order created (MOCK)', data: { order } });
        return;
    }
    const service = await Service_1.default.findById(serviceId);
    if (!service || !service.isActive) {
        res.status(404).json({ success: false, message: 'Service not found or inactive' });
        return;
    }
    const order = await Order_1.default.create({
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
exports.createOrder = createOrder;
// GET /api/orders/my  [Customer]
const getMyOrders = async (req, res) => {
    const { status } = req.query;
    const filter = { customerId: req.user?.userId };
    if (status)
        filter.status = status;
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const orders = mockStore_1.mockData.orders.filter((o) => o.customerId === req.user?.userId);
        if (status) {
            res.status(200).json({ success: true, data: { orders: orders.filter((o) => o.status === status) } });
        }
        else {
            res.status(200).json({ success: true, data: { orders } });
        }
        return;
    }
    const orders = await Order_1.default.find(filter)
        .populate('serviceId', 'title price category image')
        .populate('technicianId', 'name phone')
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { orders } });
};
exports.getMyOrders = getMyOrders;
// GET /api/orders/all  [Admin]
const getAllOrders = async (req, res) => {
    const { status, paymentStatus } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (paymentStatus)
        filter.paymentStatus = paymentStatus;
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const orders = mockStore_1.mockData.orders;
        if (status) {
            res.status(200).json({ success: true, data: { orders: orders.filter((o) => o.status === status) } });
        }
        else {
            res.status(200).json({ success: true, data: { orders } });
        }
        return;
    }
    const orders = await Order_1.default.find(filter)
        .populate('customerId', 'name email phone')
        .populate('serviceId', 'title price category')
        .populate('technicianId', 'name phone email')
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { orders } });
};
exports.getAllOrders = getAllOrders;
// GET /api/orders/assigned  [Technician]
const getAssignedOrders = async (req, res) => {
    const { status } = req.query;
    const filter = { technicianId: req.user?.userId };
    if (status)
        filter.status = status;
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const orders = mockStore_1.mockData.orders.filter((o) => o.technicianId === req.user?.userId);
        if (status) {
            res.status(200).json({ success: true, data: { orders: orders.filter((o) => o.status === status) } });
        }
        else {
            res.status(200).json({ success: true, data: { orders } });
        }
        return;
    }
    const orders = await Order_1.default.find(filter)
        .populate('customerId', 'name email phone')
        .populate('serviceId', 'title price category')
        .sort({ preferredDate: 1 });
    res.status(200).json({ success: true, data: { orders } });
};
exports.getAssignedOrders = getAssignedOrders;
// GET /api/orders/:id  [Auth]
const getOrderById = async (req, res) => {
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const order = mockStore_1.mockData.orders.find((o) => o._id === req.params.id);
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
    const order = await Order_1.default.findById(req.params.id)
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
exports.getOrderById = getOrderById;
// PUT /api/orders/:id/assign  [Admin]
const assignTechnician = async (req, res) => {
    const { technicianId } = req.body;
    if (!technicianId) {
        res.status(400).json({ success: false, message: 'technicianId is required' });
        return;
    }
    const technician = await User_1.default.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
        res.status(404).json({ success: false, message: 'Technician not found' });
        return;
    }
    const order = await Order_1.default.findByIdAndUpdate(req.params.id, { technicianId, status: 'assigned' }, { new: true })
        .populate('customerId', 'name email phone')
        .populate('serviceId', 'title price')
        .populate('technicianId', 'name phone email');
    if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
    }
    // Update technician status to busy
    await User_1.default.findByIdAndUpdate(technicianId, { technicianStatus: 'busy' });
    res.status(200).json({ success: true, message: 'Technician assigned', data: { order } });
};
exports.assignTechnician = assignTechnician;
// PUT /api/orders/:id/status  [Technician / Admin]
const updateOrderStatus = async (req, res) => {
    const { status, technicianNote, rejectReason, workProofImage } = req.body;
    const allowedStatuses = ['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid status' });
        return;
    }
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
    }
    // Technician can only update their own assigned order
    if (req.user?.role === 'technician' &&
        order.technicianId?.toString() !== req.user.userId) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
    }
    order.status = status;
    if (technicianNote)
        order.technicianNote = technicianNote;
    if (rejectReason)
        order.rejectReason = rejectReason;
    if (workProofImage)
        order.workProofImage = workProofImage;
    // Free up technician if completed/rejected/cancelled
    if (['completed', 'rejected', 'cancelled'].includes(status) && order.technicianId) {
        await User_1.default.findByIdAndUpdate(order.technicianId, { technicianStatus: 'available' });
    }
    await order.save();
    const updated = await order.populate([
        { path: 'customerId', select: 'name email phone' },
        { path: 'serviceId', select: 'title price' },
        { path: 'technicianId', select: 'name phone email' },
    ]);
    res.status(200).json({ success: true, message: 'Order status updated', data: { order: updated } });
};
exports.updateOrderStatus = updateOrderStatus;
// PUT /api/orders/:id/cancel  [Customer]
const cancelOrder = async (req, res) => {
    const order = await Order_1.default.findById(req.params.id);
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
exports.cancelOrder = cancelOrder;
// GET /api/orders/reports  [Admin]
const getReports = async (req, res) => {
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const revenue = mockStore_1.mockData.orders.filter((o) => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0);
        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalOrders: mockStore_1.mockData.orders.length,
                    completedOrders: mockStore_1.mockData.orders.filter((o) => o.status === 'completed').length,
                    pendingOrders: mockStore_1.mockData.orders.filter((o) => o.status === 'pending').length,
                    activeOrders: mockStore_1.mockData.orders.filter((o) => ['assigned', 'accepted', 'in_progress'].includes(o.status)).length,
                    revenue,
                    pendingPayments: mockStore_1.mockData.orders.filter((o) => o.status === 'completed' && o.paymentStatus === 'pending').length,
                    totalUsers: mockStore_1.mockData.users.length,
                    totalCustomers: mockStore_1.mockData.users.filter((u) => u.role === 'customer').length,
                    totalTechnicians: mockStore_1.mockData.users.filter((u) => u.role === 'technician').length,
                },
                monthlyRevenue: [],
            },
        });
        return;
    }
    const [totalOrders, completedOrders, pendingOrders, activeOrders, totalRevenue, totalUsers, totalCustomers, totalTechnicians,] = await Promise.all([
        Order_1.default.countDocuments(),
        Order_1.default.countDocuments({ status: 'completed' }),
        Order_1.default.countDocuments({ status: 'pending' }),
        Order_1.default.countDocuments({ status: { $in: ['assigned', 'accepted', 'in_progress'] } }),
        Order_1.default.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        User_1.default.countDocuments(),
        User_1.default.countDocuments({ role: 'customer' }),
        User_1.default.countDocuments({ role: 'technician' }),
    ]);
    const revenue = totalRevenue[0]?.total || 0;
    const pendingPayments = await Order_1.default.countDocuments({
        status: 'completed',
        paymentStatus: 'pending',
    });
    // Monthly revenue breakdown (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order_1.default.aggregate([
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
exports.getReports = getReports;
//# sourceMappingURL=orderController.js.map