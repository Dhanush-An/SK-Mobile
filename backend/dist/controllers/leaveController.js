"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveController = void 0;
const Leave_1 = __importDefault(require("../models/Leave"));
exports.leaveController = {
    apply: async (req, res) => {
        try {
            const { reason, startDate, endDate } = req.body;
            const technicianId = req.user?.userId;
            const leave = new Leave_1.default({
                technicianId,
                reason,
                startDate,
                endDate
            });
            await leave.save();
            // Notify admin (using a fixed admin ID or finding one - for demo we'll skip finding and just assume notification list is filtered)
            // Or we can just skip notifications for real DB if it's not well defined yet.
            res.status(201).json({ success: true, data: leave });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    getAll: async (req, res) => {
        try {
            const isAdmin = req.user?.role === 'admin';
            const userId = req.user?.userId;
            let query = {};
            if (!isAdmin) {
                query = { technicianId: userId };
            }
            const leaves = await Leave_1.default.find(query).populate('technicianId', 'name email').sort({ createdAt: -1 });
            res.json({ success: true, data: leaves });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!['approved', 'rejected'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }
            const leave = await Leave_1.default.findByIdAndUpdate(id, { status }, { new: true });
            if (!leave) {
                return res.status(404).json({ success: false, message: 'Leave request not found' });
            }
            res.json({ success: true, data: leave });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};
//# sourceMappingURL=leaveController.js.map