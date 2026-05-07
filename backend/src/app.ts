import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import serviceRoutes from './routes/serviceRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';
import notificationRoutes from './routes/notificationRoutes';
import productRoutes from './routes/productRoutes';
import leaveRoutes from './routes/leaveRoutes';
import trackingRoutes from './routes/trackingRoutes';
import campaignRoutes from './routes/campaignRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'SK Technology API is running 🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/campaigns', campaignRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
