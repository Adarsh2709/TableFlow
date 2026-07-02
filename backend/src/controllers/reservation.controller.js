import * as reservationService from '../services/reservation.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.bookReservation(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { reservation }, 'Reservation created successfully'));
});

export const getMyReservations = catchAsync(async (req, res) => {
  const reservations = await reservationService.getMyReservations(req.user.id);
  res.status(200).json(new ApiResponse(200, { reservations }, 'Reservations retrieved successfully'));
});

export const getReservationById = catchAsync(async (req, res) => {
  const reservation = await reservationService.getReservationDetails(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, { reservation }, 'Reservation details retrieved'));
});

export const cancelReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.cancelReservation(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, { reservation }, 'Reservation cancelled successfully'));
});
