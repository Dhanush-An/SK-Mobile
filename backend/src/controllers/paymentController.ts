import { Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order';
import Payment from '../models/Payment';
import { AuthRequest } from '../middleware/authMiddleware';

const getRazorpay = (): Razorpay => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay credentials not configured');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// POST /api/payments/create-order  [Customer]
export const createPaymentOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400).json({ success: false, message: 'orderId is required' });
    return;
  }

  const order = await Order.findById(orderId);
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
      orderId: order._id!.toString(),
      customerId: req.user.userId,
    },
  });

  const payment = await Payment.create({
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

// POST /api/payments/verify  [Customer]
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
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
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    // Mark payment as failed
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature, status: 'failed' }
    );
    res.status(400).json({ success: false, message: 'Payment verification failed - invalid signature' });
    return;
  }

  // Update payment record
  await Payment.findOneAndUpdate(
    { razorpayOrderId },
    { razorpayPaymentId, razorpaySignature, status: 'paid' }
  );

  // Update order payment status
  await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });

  res.status(200).json({
    success: true,
    message: 'Payment verified and recorded successfully',
  });
};

// GET /api/payments/order/:orderId  [Customer/Admin]
export const getPaymentByOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const payment = await Payment.findOne({ orderId: req.params.orderId });
  if (!payment) {
    res.status(404).json({ success: false, message: 'Payment record not found' });
    return;
  }
  res.status(200).json({ success: true, data: { payment } });
};
