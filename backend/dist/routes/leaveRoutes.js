"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = require("../controllers/leaveController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.post('/apply', authMiddleware_1.protect, leaveController_1.leaveController.apply);
router.get('/', authMiddleware_1.protect, leaveController_1.leaveController.getAll);
router.put('/:id/status', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), leaveController_1.leaveController.updateStatus);
exports.default = router;
//# sourceMappingURL=leaveRoutes.js.map