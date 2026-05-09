"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignController = void 0;
const Campaign_1 = __importDefault(require("../models/Campaign"));
exports.campaignController = {
    getAll: async (req, res) => {
        try {
            const campaigns = await Campaign_1.default.find({ isActive: true }).sort({ createdAt: -1 });
            res.json({ success: true, data: campaigns });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    create: async (req, res) => {
        try {
            const { title, description, discount, voucherCode, image } = req.body;
            const campaign = await Campaign_1.default.create({
                title,
                description,
                discount,
                voucherCode,
                image,
            });
            res.json({ success: true, data: campaign });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await Campaign_1.default.findByIdAndDelete(id);
            res.json({ success: true, message: 'Campaign deleted' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};
//# sourceMappingURL=campaignController.js.map