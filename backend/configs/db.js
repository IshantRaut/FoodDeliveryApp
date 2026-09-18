import mongoose from 'mongoose';
import 'dotenv/config.js';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food-delivery';
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;