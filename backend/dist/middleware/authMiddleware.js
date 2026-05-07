"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const mockStore_1 = require("../utils/mockStore");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({ success: false, message: 'Not authorized, no token' });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error('JWT_SECRET is not defined');
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Mock Mode
        if (!(0, mockStore_1.isDbConnected)()) {
            const user = mockStore_1.mockData.users.find(u => u._id === decoded.userId);
            if (!user || !user.isActive) {
                res.status(401).json({ success: false, message: 'User not found (MOCK)' });
                return;
            }
            req.user = { userId: decoded.userId, role: decoded.role };
            return next();
        }
        // Check user still exists and is active
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'User not found or deactivated' });
            return;
        }
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map