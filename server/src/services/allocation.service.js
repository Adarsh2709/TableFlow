import { findTablesByMinimumCapacity } from '../repositories/table.repository.js';
import { findConflictingReservations } from '../repositories/reservation.repository.js';
import ApiError from '../utils/ApiError.js';

/**
 * Check if the selected time and date have conflicting reservations
 */
export const checkConflict = async (reservationDate, timeSlot, session) => {
  const conflictingReservations = await findConflictingReservations(reservationDate, timeSlot, session);
  return conflictingReservations.map(res => res.table.toString());
};

/**
 * Find all available tables for the given capacity, date, and time
 */
export const findAvailableTable = async (guests, reservationDate, timeSlot, session) => {
  // 1. Get tables with enough capacity
  const tables = await findTablesByMinimumCapacity(guests, session);
  if (!tables || tables.length === 0) {
    return null; // No tables exist with this capacity
  }

  // 2. Find currently booked tables for this date and time
  const bookedTableIds = await checkConflict(reservationDate, timeSlot, session);

  // 3. Filter out booked tables
  const availableTables = tables.filter(
    table => !bookedTableIds.includes(table._id.toString())
  );

  return availableTables;
};

/**
 * Core allocation logic: Assign the smallest available table that satisfies guest capacity
 */
export const allocateSmallestTable = async (guests, reservationDate, timeSlot, session) => {
  const availableTables = await findAvailableTable(guests, reservationDate, timeSlot, session);

  if (!availableTables || availableTables.length === 0) {
    throw new ApiError(409, 'Sorry, no tables available.');
  }

  // The tables returned from findTablesByMinimumCapacity are already sorted by capacity ascending.
  // The first table in the filtered array will be the smallest available table.
  return availableTables[0];
};
