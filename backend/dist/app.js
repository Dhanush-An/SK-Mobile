"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
require("dotenv/config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const trackingRoutes_1 = __importDefault(require("./routes/trackingRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// CORS
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'SK Technology API is running 🚀' });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/expenses', expenseRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/leaves', leaveRoutes_1.default);
app.use('/api/tracking', trackingRoutes_1.default);
app.use('/api/campaigns', campaignRoutes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// Global error handler (must be last)
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map