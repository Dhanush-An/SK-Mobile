"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.get('/', expenseController_1.getExpenses);
router.post('/', (0, roleMiddleware_1.requireRole)('technician', 'admin'), expenseController_1.createExpense);
router.put('/:id/status', (0, roleMiddleware_1.requireRole)('admin'), expenseController_1.updateExpenseStatus);
exports.default = router;
//# sourceMappingURL=expenseRoutes.js.map