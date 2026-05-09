"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getMyNotifications = exports.createNotificationInternal = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
// Internal utility to create notifications
const createNotificationInternal = async (userId, title, message, type) => {
    return await Notification_1.default.create({ userId, title, message, type });
};
exports.createNotificationInternal = createNotificationInternal;
// GET /api/notifications
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification_1.default.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyNotifications = getMyNotifications;
// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        await Notification_1.default.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAsRead = markAsRead;
//# sourceMappingURL=notificationController.js.map