import * as analyticsService from '../services/analytics.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getDashboardOverview = catchAsync(async (req, res) => {
  const { date } = req.query;
  
  const stats = await analyticsService.getDashboardStats(date);
  const occupancy = await analyticsService.getOccupancyRate(date);
  
  res.status(200).json(new ApiResponse(200, {
    ...stats,
    occupancyRate: occupancy.occupancyRate
  }, 'Dashboard overview retrieved successfully'));
});

export const getTrends = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const end = endDate || new Date().toISOString().split('T')[0];
  const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const trends = await analyticsService.getReservationTrends(start, end);
  
  res.status(200).json(new ApiResponse(200, { trends }, 'Reservation trends retrieved successfully'));
});

export const getPopularTables = catchAsync(async (req, res) => {
  const tables = await analyticsService.getMostUsedTables();
  res.status(200).json(new ApiResponse(200, { tables }, 'Popular tables retrieved successfully'));
});
