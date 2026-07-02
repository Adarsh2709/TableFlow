# TableFlow Backend

TableFlow is a Smart Restaurant Reservation Platform built with clean architecture in Node.js, Express, and MongoDB.

## Features & Architecture

- **Clean Architecture:** Controllers -> Services -> Repositories -> Models.
- **Smart Allocation:** An atomic allocation algorithm assigning the smallest suitable table to guests without double booking.
- **Transactions:** MongoDB Session Transactions (`mongoose.startSession()`) to safely handle high-concurrency reservation attempts.
- **Roles & Auth:** JWT based Authentication with Admin/Customer roles.
- **Admin APIs:** Pagination, filtering, and sorting for managing tables and reservations.
- **Docs:** Automated Swagger UI API Documentation.
- **Validation:** Strong payload validations via `express-validator`.

## Folder Structure

```
server/
├── src/
│   ├── config/          # DB, Env, Swagger configurations
│   ├── constants/       # Enums and global constants
│   ├── controllers/     # Request/Response handlers
│   ├── middleware/      # Auth, Validation, Error Handling
│   ├── models/          # Mongoose Schemas & Indexes
│   ├── repositories/    # Database Data Access Layer
│   ├── routes/          # Express Routers
│   ├── services/        # Core Business Logic (Allocation, Auth)
│   ├── utils/           # Logger, API Responses, Error Classes
│   ├── validators/      # Express Validator Rules
│   ├── seed/            # Seed and Unseed scripts
│   ├── app.js           # Express App Setup
│   └── server.js        # Server Entry Point
```

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and adjust the variables.

3. Seed the database (creates 1 admin and 10 tables):
   ```bash
   npm run seed
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Swagger API Documentation

Once the server is running, the API documentation is available at:
**[http://localhost:5000/api/docs](http://localhost:5000/api/docs)**

## Reservation Allocation Algorithm

The core allocation logic is handled in `services/allocation.service.js`:
1. **Find Eligible Tables:** Retrieve all active tables where `capacity >= guests`.
2. **Sort by Capacity:** Sort the eligible tables in ascending order to ensure we prioritize the smallest tables.
3. **Conflict Checking:** Retrieve all uncancelled reservations for the requested `reservationDate` and `timeSlot`.
4. **Filter:** Remove any tables from step 2 that exist in the conflicts list.
5. **Assign:** If the resulting list is not empty, assign the first table (which is the smallest suitable and available). If empty, throw a `409 Conflict`.
This entire process is wrapped in a MongoDB transaction to prevent race conditions during concurrent bookings.

## API Flow
- Client makes a request to a route (e.g., `POST /api/reservations`).
- Request passes through `authenticate` and `createReservationValidator` middlewares.
- The `ReservationController` parses the request body and user context.
- The Controller calls the `ReservationService`.
- The `ReservationService` initiates a transaction and calls the `AllocationService`.
- `AllocationService` interacts with `TableRepository` and `ReservationRepository` to find conflicts and allocate.
- Results bubble back up and the Controller returns a standardized `ApiResponse`.

## Postman Collection
A Postman collection is included in the `postman/` directory for easy testing.

## Future Improvements
- **Caching:** Introduce Redis caching for table lookups and availability.
- **Rate Limiting:** Implement a global rate limiter using `express-rate-limit`.
- **Payment Gateway:** Integration with Stripe for paid reservations or holding fees.