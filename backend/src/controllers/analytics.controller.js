import * as analyticsService from '../services/analytics.service.js';
import catchAsync from '../utils/catchAsync.js';
import sendResponse from '../utils/sendResponse.js';

export const getDashboardOverview = catchAsync(async (req, res) => {
  const { date } = req.query;
  
  const stats = await analyticsService.getDashboardStats(date);
  const occupancy = await analyticsService.getOccupancyRate(date);
  
  sendResponse(res, 200, 'Dashboard overview retrieved successfully', {
    ...stats,
    occupancyRate: occupancy.occupancyRate
  });
});

export const getTrends = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Default to last 7 days if not provided
  const end = endDate || new Date().toISOString().split('T')[0];
  const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const trends = await analyticsService.getReservationTrends(start, end);
  
  sendResponse(res, 200, 'Reservation trends retrieved successfully', { trends });
});

export const getPopularTables = catchAsync(async (req, res) => {
  const tables = await analyticsService.getMostUsedTables();
  sendResponse(res, 200, 'Popular tables retrieved successfully', { tables });
});
