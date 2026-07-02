import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://jhaadarsh709_db_user:otmEVMI3plL6Qw6U@tableflow.mkmcflh.mongodb.net/tableflow?appName=TableFlow',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
const requiredEnvs = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];
for (const envName of requiredEnvs) {
  if (!process.env[envName] && config.nodeEnv === 'production') {
    console.warn(`Warning: Environment variable ${envName} is not set.`);
  }
}
