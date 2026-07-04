import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import RestaurantTable from '../models/RestaurantTable.js';
import Reservation from '../models/Reservation.js';
import logger from '../utils/logger.js';

dotenv.config();

const unseedDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      logger.error('MONGODB_URI environment variable is not set.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for unseeding');

    await User.deleteMany();
    await RestaurantTable.deleteMany();
    await Reservation.deleteMany();

    logger.info('Database unseeded successfully (All collections cleared)');
    process.exit();
  } catch (error) {
    logger.error('Error unseeding DB:', error);
    process.exit(1);
  }
};

unseedDB();
