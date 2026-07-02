import * as reservationService from '../services/reservation.service.js';
import * as tableService from '../services/table.service.js';
import catchAsync from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

// Table Management
export const createTable = catchAsync(async (req, res) => {
  const table = await tableService.addTable(req.body);
  res.status(201).json(new ApiResponse(201, { table }, 'Table created successfully'));
});

export const getAllTables = catchAsync(async (req, res) => {
  const tables = await tableService.getTables();
  res.status(200).json(new ApiResponse(200, { tables }, 'Tables retrieved'));
});

export const updateTable = catchAsync(async (req, res) => {
  const table = await tableService.updateTable(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { table }, 'Table updated successfully'));
});

export const deleteTable = catchAsync(async (req, res) => {
  await tableService.deleteTable(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Table deleted successfully'));
});

// Reservation Management
export const getAllReservations = catchAsync(async (req, res) => {
  const result = await reservationService.getAllReservationsPaginated(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Reservations retrieved successfully'));
});

export const getReservationsByDate = catchAsync(async (req, res) => {
  req.query.date = req.params.date;
  const result = await reservationService.getAllReservationsPaginated(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Reservations retrieved for date'));
});

export const updateReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminUpdateReservation(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { reservation }, 'Reservation status updated'));
});

export const deleteReservation = catchAsync(async (req, res) => {
  await reservationService.adminDeleteReservation(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Reservation deleted successfully'));
});
