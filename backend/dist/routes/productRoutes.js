"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = (0, express_1.Router)();
router.get('/', productController_1.getProducts);
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), productController_1.createProduct);
router.delete('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.requireRole)('admin'), productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map