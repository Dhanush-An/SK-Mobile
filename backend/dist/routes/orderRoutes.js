"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Customer
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('customer'), orderController_1.createOrder);
router.get('/my', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('customer'), orderController_1.getMyOrders);
router.put('/:id/cancel', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('customer'), orderController_1.cancelOrder);
// Admin
router.get('/all', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), orderController_1.getAllOrders);
router.get('/reports', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), orderController_1.getReports);
router.put('/:id/assign', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), orderController_1.assignTechnician);
// Technician
router.get('/assigned', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('technician'), orderController_1.getAssignedOrders);
// Admin + Technician
router.put('/:id/status', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin', 'technician'), orderController_1.updateOrderStatus);
// Any authenticated user (access controlled in controller)
router.get('/:id', authMiddleware_1.protect, orderController_1.getOrderById);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map