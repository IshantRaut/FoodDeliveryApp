import mongoose from 'mongoose';
import 'dotenv/config.js';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI && process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI is not configured');
    }

    await mongoose.connect(
      mongoURI || 'mongodb://127.0.0.1:27017/food-delivery',
      { serverSelectionTimeoutMS: 10000 }
    );
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;