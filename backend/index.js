import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import listingRoute from './routes/listing.route.js';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('MongoDB URI:', process.env.MONGODB_URL ? 'URI is set' : 'URI is undefined');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/listing', listingRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000!');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();
