"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_MOCK_MODE = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.IS_MOCK_MODE = false;
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri || mongoUri.includes('<username>')) {
            console.warn('⚠️ MONGO_URI is a placeholder. Starting in MOCK MODE (In-memory storage).');
            exports.IS_MOCK_MODE = true;
            return;
        }
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.warn('⚠️ Starting in MOCK MODE due to connection failure.');
        exports.IS_MOCK_MODE = true;
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map