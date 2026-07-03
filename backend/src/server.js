import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import logger from './utils/logger.js';

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`Backend server successfully started on port ${config.port}`);
    logger.info(`Swagger docs available at http://localhost:${config.port}/api/docs`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer();
