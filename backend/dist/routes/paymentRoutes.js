"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.post('/create-order', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('customer'), paymentController_1.createPaymentOrder);
router.post('/verify', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('customer'), paymentController_1.verifyPayment);
router.get('/order/:orderId', authMiddleware_1.protect, paymentController_1.getPaymentByOrder);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map