"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentByOrder = exports.verifyPayment = exports.createPaymentOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const Order_1 = __importDefault(require("../models/Order"));
const Payment_1 = __importDefault(require("../models/Payment"));
const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret)
        throw new Error('Razorpay credentials not configured');
    return new razorpay_1.default({ key_id: keyId, key_secret: keySecret });
};
// POST /api/payments/create-order  [Customer]
const createPaymentOrder = async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
        res.status(400).json({ success: false, message: 'orderId is required' });
        return;
    }
    const order = await Order_1.default.findById(orderId);
    if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
    }
    if (order.customerId.toString() !== req.user?.userId) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
    }
    if (order.paymentStatus === 'paid') {
        res.status(400).json({ success: false, message: 'Order already paid' });
        return;
    }
    const razorpay = getRazorpay();
    const amountInPaise = Math.round(order.totalAmount * 100); // Razorpay uses paise
    const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `order_${order._id}`,
        notes: {
            orderId: order._id.toString(),
            customerId: req.user.userId,
        },
    });
    const payment = await Payment_1.default.create({
        orderId: order._id,
        customerId: req.user.userId,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        status: 'created',
    });
    res.status(200).json({
        success: true,
        message: 'Payment order created',
        data: {
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID,
            paymentId: payment._id,
        },
    });
};
exports.createPaymentOrder = createPaymentOrder;
// POST /api/payments/verify  [Customer]
const verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
        res.status(400).json({ success: false, message: 'All payment verification fields are required' });
        return;
    }
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        res.status(500).json({ success: false, message: 'Payment configuration error' });
        return;
    }
    // Verify signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto_1.default
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');
    if (expectedSignature !== razorpaySignature) {
        // Mark payment as failed
        await Payment_1.default.findOneAndUpdate({ razorpayOrderId }, { razorpayPaymentId, razorpaySignature, status: 'failed' });
        res.status(400).json({ success: false, message: 'Payment verification failed - invalid signature' });
        return;
    }
    // Update payment record
    await Payment_1.default.findOneAndUpdate({ razorpayOrderId }, { razorpayPaymentId, razorpaySignature, status: 'paid' });
    // Update order payment status
    await Order_1.default.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
    res.status(200).json({
        success: true,
        message: 'Payment verified and recorded successfully',
    });
};
exports.verifyPayment = verifyPayment;
// GET /api/payments/order/:orderId  [Customer/Admin]
const getPaymentByOrder = async (req, res) => {
    const payment = await Payment_1.default.findOne({ orderId: req.params.orderId });
    if (!payment) {
        res.status(404).json({ success: false, message: 'Payment record not found' });
        return;
    }
    res.status(200).json({ success: true, data: { payment } });
};
exports.getPaymentByOrder = getPaymentByOrder;
//# sourceMappingURL=paymentController.js.map