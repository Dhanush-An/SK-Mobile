"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = require("../controllers/campaignController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/all', campaignController_1.campaignController.getAll);
router.post('/create', authMiddleware_1.protect, (0, authMiddleware_1.requireRole)('admin'), campaignController_1.campaignController.create);
router.delete('/:id', authMiddleware_1.protect, (0, authMiddleware_1.requireRole)('admin'), campaignController_1.campaignController.delete);
exports.default = router;
//# sourceMappingURL=campaignRoutes.js.map