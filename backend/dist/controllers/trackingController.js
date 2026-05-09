"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingController = void 0;
const Tracking_1 = __importDefault(require("../models/Tracking"));
exports.trackingController = {
    updateLocation: async (req, res) => {
        try {
            const { latitude, longitude, orderId } = req.body;
            const technicianId = req.user?.userId;
            const tracking = await Tracking_1.default.findOneAndUpdate({ technicianId }, { latitude, longitude, orderId, updatedAt: new Date() }, { upsert: true, new: true });
            res.json({ success: true, data: tracking });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    getTechnicianLocation: async (req, res) => {
        try {
            const { technicianId } = req.params;
            const tracking = await Tracking_1.default.findOne({ technicianId });
            if (!tracking) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }
            res.json({ success: true, data: tracking });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    getAllActiveTracking: async (req, res) => {
        try {
            const tracking = await Tracking_1.default.find().populate('technicianId', 'name');
            res.json({ success: true, data: tracking });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};
//# sourceMappingURL=trackingController.js.map