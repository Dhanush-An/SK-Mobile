"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/profile', authMiddleware_1.protect, authController_1.getProfile);
router.put('/profile', authMiddleware_1.protect, authController_1.updateProfile);
router.post('/onboard-tech', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), authController_1.onboardTechnician);
router.get('/technicians', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), authController_1.getTechnicians);
router.put('/users/:id', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), authController_1.updateUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map