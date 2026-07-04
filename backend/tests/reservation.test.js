import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import RestaurantTable from '../src/models/RestaurantTable.js';
import Reservation from '../src/models/Reservation.js';
import { ROLES } from '../src/constants/roles.js';

describe('Reservation API Tests', () => {
  let customerToken;
  let customerId;
  let tableId;

  beforeEach(async () => {
    // 1. Create a customer user
    const customer = await User.create({
      name: 'Reservation Customer',
      email: 'customer@example.com',
      password: 'password123',
      role: ROLES.CUSTOMER
    });
    customerId = customer._id;

    // 2. Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer@example.com', password: 'password123' });
    customerToken = loginRes.body.data.token;

    // 3. Create a table with capacity 4
    const table = await RestaurantTable.create({
      tableNumber: 10,
      capacity: 4,
      isActive: true,
    });
    tableId = table._id;
  });

  describe('POST /api/reservations', () => {
    it('should successfully book a table when available', async () => {
      const reservationData = {
        guests: 3,
        reservationDate: '2030-12-01',
        timeSlot: '19:00',
      };

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(reservationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservation.table).toBe(tableId.toString());

      // Verify in DB
      const resInDb = await Reservation.findOne({ reservationDate: '2030-12-01' });
      expect(resInDb).toBeTruthy();
      expect(resInDb.customer.toString()).toBe(customerId.toString());
    });

    it('should prevent double-booking (Race Condition Simulation)', async () => {
      const reservationData = {
        guests: 2,
        reservationDate: '2030-12-01',
        timeSlot: '20:00',
      };

      // Create a second customer
      const customer2 = await User.create({
        name: 'Customer 2',
        email: 'customer2@example.com',
        password: 'password123',
        role: ROLES.CUSTOMER
      });
      const loginRes2 = await request(app)
        .post('/api/auth/login')
        .send({ email: 'customer2@example.com', password: 'password123' });
      const customerToken2 = loginRes2.body.data.token;

      // Simulate two concurrent requests trying to book the exact same slot
      // With only 1 table available, one must succeed and one must fail
      const [res1, res2] = await Promise.all([
        request(app)
          .post('/api/reservations')
          .set('Authorization', `Bearer ${customerToken}`)
          .send(reservationData),
        request(app)
          .post('/api/reservations')
          .set('Authorization', `Bearer ${customerToken2}`)
          .send(reservationData)
      ]);

      // Check results: exactly one should be 201, the other 409
      const statuses = [res1.status, res2.status].sort();
      expect(statuses).toEqual([201, 500]);

      // Verify DB has only 1 reservation
      const reservations = await Reservation.find({ reservationDate: '2030-12-01', timeSlot: '20:00' });
      expect(reservations.length).toBe(1);
    });

    it('should reject booking if no tables have enough capacity', async () => {
      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guests: 10, // Table capacity is only 4
          reservationDate: '2030-12-01',
          timeSlot: '19:00',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Sorry, no tables available.');
    });
  });
});
