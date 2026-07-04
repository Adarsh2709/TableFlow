import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  // Start MongoDB Memory Server as a Replica Set to support transactions
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const mongoUri = mongoServer.getUri();

  // Connect Mongoose to the in-memory database
  await mongoose.connect(mongoUri);

  // Sync indexes to ensure unique constraints are active immediately
  await mongoose.syncIndexes();
});

afterAll(async () => {
  // Disconnect and stop the server
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear all data between tests to ensure test isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
