import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '../.env') });

async function resetDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('Dropping all collections...');
    const collections = await db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`- Dropped ${collection.collectionName}`);
    }

    console.log('Seeding Admin User...');
    const hash = await bcrypt.hash('Admin@123', 10);
    await db.collection('users').insertOne({
      name: 'System Administrator',
      email: 'admin@tableflow.com',
      password: hash,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('- Created admin@tableflow.com');

    console.log('Seeding standard tables...');
    const tables = [
      { tableNumber: 1, capacity: 2, isAvailable: true },
      { tableNumber: 2, capacity: 2, isAvailable: true },
      { tableNumber: 3, capacity: 4, isAvailable: true },
      { tableNumber: 4, capacity: 4, isAvailable: true },
      { tableNumber: 5, capacity: 6, isAvailable: true },
      { tableNumber: 6, capacity: 8, isAvailable: true }
    ];
    await db.collection('tables').insertMany(tables.map(t => ({...t, createdAt: new Date(), updatedAt: new Date()})));
    console.log('- Created standard tables');

    console.log('Database reset complete.');
    process.exit(0);
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
}

resetDB();
