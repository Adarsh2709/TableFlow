import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import RestaurantTable from '../models/RestaurantTable.js';
import Reservation from '../models/Reservation.js';
import logger from '../utils/logger.js';

dotenv.config();

const unseedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jhaadarsh709_db_user:otmEVMI3plL6Qw6U@tableflow.mkmcflh.mongodb.net/tableflow?appName=TableFlow');
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
