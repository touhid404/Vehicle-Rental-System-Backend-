import { pool } from "../../config/db";

export const createBookingInDB = async (payload: Record<string, unknown>) => {
  // 1. Insert booking
  const insertQuery = `
    INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    payload.customer_id,
    payload.vehicle_id,
    payload.rent_start_date,
    payload.rent_end_date,
    payload.total_price,
    payload.status,
  ];

  const bookingResult = await pool.query(insertQuery, values);
  const booking = bookingResult.rows[0];

  // 2. Update vehicle status
  await pool.query(
    `UPDATE vehicles 
     SET availability_status = 'booked'
     WHERE id = $1`,
    [payload.vehicle_id]
  );

  // 3. Fetch vehicle details ONCE
  const vehicleDetails = await pool.query(
    `SELECT vehicle_name, daily_rent_price 
     FROM vehicles 
     WHERE id = $1`,
    [payload.vehicle_id]
  );

  const vehicle = vehicleDetails.rows[0];

  // 4. Return combined result
  return {
    ...booking,
    vehicle,
  };
};

export const checkVehicleAvailability = async (vehicleId: number) => {
  return pool.query(
    "SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'",
    [vehicleId]
  );
};

export const getAllBookingsFromDB = async () => {
  const result = await pool.query("SELECT * FROM bookings");
  return result.rows;
};
export const getAllBookingsOfCustomerDB = async (customerId: number) => {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE customer_id = $1",
    [customerId]
  );
  return result.rows;
};

export const checkBookingStartDate = async (bookingId: number) => {
  const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [
    bookingId,
  ]);
  return result.rows[0];
};

export const updateBookingsInDB = async (
  bookingId: number,
  status: string
) => {};

// return type
// {
//   "success": true,
//   "message": "Booking cancelled successfully",
//   "data": {
//     "id": 1,
//     "customer_id": 1,
//     "vehicle_id": 2,
//     "rent_start_date": "2024-01-15",
//     "rent_end_date": "2024-01-20",
//     "total_price": 250,
//     "status": "cancelled"
//   }
// }
