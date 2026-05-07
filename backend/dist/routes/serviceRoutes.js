"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.get('/', serviceController_1.getServices); // Public
router.get('/:id', serviceController_1.getServiceById); // Public
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), serviceController_1.createService); // Admin
router.put('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), serviceController_1.updateService); // Admin
router.delete('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), serviceController_1.deleteService); // Admin
exports.default = router;
//# sourceMappingURL=serviceRoutes.js.map