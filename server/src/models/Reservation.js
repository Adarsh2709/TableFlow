import mongoose from 'mongoose';
import { RESERVATION_STATUS, RESERVATION_STATUS_VALUES } from '../constants/reservationStatus.js';

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RestaurantTable',
      required: [true, 'Table ID is required'],
    },
    reservationDate: {
      type: String, // Store as YYYY-MM-DD for simple equality checks
      required: [true, 'Reservation date is required'],
    },
    timeSlot: {
      type: String, // from TIME_SLOTS enum (e.g. '18:00')
      required: [true, 'Time slot is required'],
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Guests must be at least 1'],
    },
    status: {
      type: String,
      enum: RESERVATION_STATUS_VALUES,
      default: RESERVATION_STATUS.CONFIRMED,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for strict allocation constraints and queries
// A table cannot have two active (PENDING/CONFIRMED) reservations at the same time
reservationSchema.index({ table: 1, reservationDate: 1, timeSlot: 1 });
reservationSchema.index({ customer: 1, reservationDate: 1 }); // For querying user's reservations
reservationSchema.index({ status: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
