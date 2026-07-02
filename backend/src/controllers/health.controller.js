import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

export const checkHealth = catchAsync(async (req, res) => {
  const healthData = {
    server: 'Running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    mongo: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  };

  res.status(200).json(new ApiResponse(200, healthData, 'Health check passed'));
});
