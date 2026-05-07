"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
// Admin routes
router.get('/', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), userController_1.getAllUsers);
router.get('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), userController_1.getUserById);
router.put('/:id/role', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), userController_1.updateUserRole);
router.put('/:id/status', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), userController_1.updateUserStatus);
// Technician route
router.put('/technician/status', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('technician'), userController_1.updateTechnicianStatus);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map