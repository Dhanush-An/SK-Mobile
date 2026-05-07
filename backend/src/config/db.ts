import mongoose from 'mongoose';

export let IS_MOCK_MODE = false;

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes('<username>')) {
      console.warn('⚠️ MONGO_URI is a placeholder. Starting in MOCK MODE (In-memory storage).');
      IS_MOCK_MODE = true;
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    console.warn('⚠️ Starting in MOCK MODE due to connection failure.');
    IS_MOCK_MODE = true;
  }
};

export default connectDB;
