import mongoose from 'mongoose';
import { allocateSmallestTable } from './allocation.service.js';
import { createReservation, findReservationsByUser, findReservationById, updateReservationStatus, findPaginatedReservations, deleteReservationById } from '../repositories/reservation.repository.js';
import { RESERVATION_STATUS } from '../constants/reservationStatus.js';
import ApiError from '../utils/ApiError.js';

export const bookReservation = async (userId, reservationData) => {
  const { guests, reservationDate, timeSlot } = reservationData;

  // Start MongoDB transaction to prevent race conditions during double booking
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Run the allocation algorithm to find the optimal table
    const optimalTable = await allocateSmallestTable(guests, reservationDate, timeSlot, session);

    // 2. Create the reservation
    const newReservationData = {
      customer: userId,
      table: optimalTable._id,
      reservationDate,
      timeSlot,
      guests,
      status: RESERVATION_STATUS.CONFIRMED,
    };

    const reservation = await createReservation(newReservationData, session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return reservation;
  } catch (error) {
    // Abort transaction in case of error (e.g., 409 Conflict)
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getMyReservations = async (userId) => {
  return await findReservationsByUser(userId);
};

export const getReservationDetails = async (id, userId) => {
  const reservation = await findReservationById(id);
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }
  
  // Ensure the user owns this reservation (unless admin checks, but this is user level)
  if (reservation.customer._id.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to view this reservation');
  }
  
  return reservation;
};

export const cancelReservation = async (id, userId) => {
  const reservation = await findReservationById(id);
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }

  if (reservation.customer._id.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this reservation');
  }

  if (reservation.status === RESERVATION_STATUS.CANCELLED) {
    throw new ApiError(400, 'Reservation is already cancelled');
  }

  return await updateReservationStatus(id, RESERVATION_STATUS.CANCELLED);
};

// Admin Functions
export const getAllReservationsPaginated = async (query) => {
  const filter = {};
  
  if (query.status) filter.status = query.status;
  if (query.date) filter.reservationDate = query.date;
  if (query.table) filter.table = query.table;
  
  // Notice we don't have a direct customer name field in the Reservation document to filter easily 
  // without aggregation or pre-fetching, but we can do a simple match if an ID is provided.
  // For search by customer name, we would typically need a full-text search or aggregation pipeline.
  // We will keep it simple here or expect customer to be passed as ID.

  const options = {
    page: parseInt(query.page, 10) || 1,
    limit: parseInt(query.limit, 10) || 10,
    sort: query.sort ? { [query.sort]: 1 } : { reservationDate: -1, timeSlot: -1 },
  };

  return await findPaginatedReservations(filter, options);
};

export const adminUpdateReservation = async (id, updateData) => {
  return await updateReservationStatus(id, updateData.status);
};

export const adminDeleteReservation = async (id) => {
  return await deleteReservationById(id);
};
