import Reservation from '../models/Reservation.js';
import { RESERVATION_STATUS } from '../constants/reservationStatus.js';

export const createReservation = async (reservationData, session = null) => {
  const options = session ? { session } : {};
  const reservation = new Reservation(reservationData);
  return await reservation.save(options);
};

export const findReservationById = async (id) => {
  return await Reservation.findById(id).populate('table', 'tableNumber capacity').populate('customer', 'name email');
};

export const findReservationsByUser = async (userId) => {
  return await Reservation.find({ customer: userId })
    .populate('table', 'tableNumber capacity')
    .sort({ reservationDate: -1, timeSlot: -1 });
};

export const updateReservationStatus = async (id, status, session = null) => {
  const options = { new: true };
  if (session) options.session = session;
  return await Reservation.findByIdAndUpdate(id, { status }, options);
};

export const findConflictingReservations = async (reservationDate, timeSlot, session = null) => {
  // We check for any reservation that is not cancelled at the given time slot
  const query = Reservation.find({
    reservationDate,
    timeSlot,
    status: { $in: [RESERVATION_STATUS.PENDING, RESERVATION_STATUS.CONFIRMED] },
  }).select('table');
  
  if (session) {
    query.session(session);
  }
  return await query.exec();
};

export const findPaginatedReservations = async (filter, options) => {
  const { page, limit, sort } = options;
  const skip = (page - 1) * limit;

  const reservations = await Reservation.find(filter)
    .populate('customer', 'name email')
    .populate('table', 'tableNumber capacity')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Reservation.countDocuments(filter);

  return {
    reservations,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const deleteReservationById = async (id, session = null) => {
  const options = session ? { session } : {};
  return await Reservation.findByIdAndDelete(id, options);
};
