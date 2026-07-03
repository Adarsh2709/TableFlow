import Reservation from '../models/Reservation.js';
import RestaurantTable from '../models/RestaurantTable.js';
import { RESERVATION_STATUS } from '../constants/reservationStatus.js';

export const getDashboardStats = async (date) => {
  const today = date || new Date().toISOString().split('T')[0];

  const pipeline = [
    {
      $facet: {
        todayReservations: [
          { $match: { reservationDate: today, status: { $ne: RESERVATION_STATUS.CANCELLED } } },
          { $count: 'count' }
        ],
        upcomingReservations: [
          { $match: { reservationDate: { $gte: today }, status: RESERVATION_STATUS.CONFIRMED } },
          { $count: 'count' }
        ],
        cancelledReservations: [
          { $match: { status: RESERVATION_STATUS.CANCELLED } },
          { $count: 'count' }
        ],
        completedReservations: [
          { $match: { status: RESERVATION_STATUS.COMPLETED } },
          { $count: 'count' }
        ],
        totalRevenue: [
          // Assuming an average cover of $85.20 for calculation since we don't have a bill model yet
          { $match: { status: RESERVATION_STATUS.COMPLETED } },
          { $group: { _id: null, totalGuests: { $sum: "$guests" } } }
        ]
      }
    }
  ];

  const result = await Reservation.aggregate(pipeline);
  const data = result[0];

  const todayCount = data.todayReservations[0]?.count || 0;
  const upcomingCount = data.upcomingReservations[0]?.count || 0;
  const cancelledCount = data.cancelledReservations[0]?.count || 0;
  const completedCount = data.completedReservations[0]?.count || 0;
  
  // Calculate mock revenue based on completed guests * $85.20
  const totalGuests = data.totalRevenue[0]?.totalGuests || 0;
  const estimatedRevenue = totalGuests * 85.20;

  return {
    today: todayCount,
    upcoming: upcomingCount,
    cancelled: cancelledCount,
    completed: completedCount,
    estimatedRevenue,
    totalGuests
  };
};

export const getOccupancyRate = async (date) => {
  const today = date || new Date().toISOString().split('T')[0];
  
  // 1. Get total active capacity of the restaurant per time slot
  // Total capacity = sum of all active tables' capacity
  const tableData = await RestaurantTable.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, totalCapacity: { $sum: "$capacity" } } }
  ]);
  
  const totalRestaurantCapacity = tableData[0]?.totalCapacity || 0;
  if (totalRestaurantCapacity === 0) return 0;

  // Assuming 4 time slots a day for full occupancy calculation
  const totalDailyCapacity = totalRestaurantCapacity * 4;

  // 2. Get total booked guests for today
  const reservationData = await Reservation.aggregate([
    { 
      $match: { 
        reservationDate: today, 
        status: { $in: [RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.COMPLETED] } 
      } 
    },
    { $group: { _id: null, totalGuests: { $sum: "$guests" } } }
  ]);

  const totalBookedGuests = reservationData[0]?.totalGuests || 0;

  const occupancyRate = (totalBookedGuests / totalDailyCapacity) * 100;
  
  return {
    occupancyRate: Math.round(occupancyRate * 100) / 100,
    totalBookedGuests,
    totalDailyCapacity
  };
};

export const getReservationTrends = async (startDate, endDate) => {
  const pipeline = [
    {
      $match: {
        reservationDate: { $gte: startDate, $lte: endDate },
        status: { $ne: RESERVATION_STATUS.CANCELLED }
      }
    },
    {
      $group: {
        _id: "$reservationDate",
        reservations: { $sum: 1 },
        guests: { $sum: "$guests" }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const results = await Reservation.aggregate(pipeline);
  
  return results.map(r => ({
    date: r._id,
    reservations: r.reservations,
    guests: r.guests,
    revenue: r.guests * 85.20 // Estimated revenue per cover
  }));
};

export const getMostUsedTables = async () => {
  const pipeline = [
    {
      $match: { status: { $ne: RESERVATION_STATUS.CANCELLED } }
    },
    {
      $group: {
        _id: "$table",
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "restauranttables",
        localField: "_id",
        foreignField: "_id",
        as: "tableDetails"
      }
    },
    { $unwind: "$tableDetails" },
    {
      $project: {
        tableNumber: "$tableDetails.tableNumber",
        capacity: "$tableDetails.capacity",
        usageCount: "$count"
      }
    },
    { $sort: { usageCount: -1 } },
    { $limit: 5 }
  ];

  return await Reservation.aggregate(pipeline);
};
