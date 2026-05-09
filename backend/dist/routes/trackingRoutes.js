"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trackingController_1 = require("../controllers/trackingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.post('/update', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('technician'), trackingController_1.trackingController.updateLocation);
router.get('/all', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), trackingController_1.trackingController.getAllActiveTracking);
router.get('/:technicianId', authMiddleware_1.protect, trackingController_1.trackingController.getTechnicianLocation);
exports.default = router;
//# sourceMappingURL=trackingRoutes.js.map