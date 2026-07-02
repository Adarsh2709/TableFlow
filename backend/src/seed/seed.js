import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import RestaurantTable from '../models/RestaurantTable.js';
import { ROLES } from '../constants/roles.js';
import logger from '../utils/logger.js';

dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jhaadarsh709_db_user:otmEVMI3plL6Qw6U@tableflow.mkmcflh.mongodb.net/tableflow?appName=TableFlow');
    logger.info('Connected to MongoDB for seeding');
  } catch (error) {
    logger.error('Error connecting to DB:', error);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@tableflow.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Super Admin',
      email: 'admin@tableflow.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: ROLES.ADMIN,
    });
    logger.info('Admin user seeded');
  } else {
    logger.info('Admin already exists');
  }
};

const seedTables = async () => {
  const tablesCount = await RestaurantTable.countDocuments();
  if (tablesCount === 0) {
    const tableCapacities = [2, 2, 2, 4, 4, 4, 6, 6, 8, 10];
    const tablesToInsert = tableCapacities.map((cap, index) => ({
      tableNumber: index + 1,
      capacity: cap,
      isActive: true,
    }));
    await RestaurantTable.insertMany(tablesToInsert);
    logger.info('10 Restaurant Tables seeded');
  } else {
    logger.info('Tables already exist');
  }
};

const runSeeder = async () => {
  await connectToDB();
  await seedAdmin();
  await seedTables();
  logger.info('Seeding completed successfully');
  process.exit();
};

runSeeder();
