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

export const updateBookingsInDB = async (bookingId: number, status: string) => {
  const query = `
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;

  const updated = await pool.query(query, [status, bookingId]);

  if (updated.rowCount === 0) {
    throw new Error("Booking not found");
  }

  const booking = updated.rows[0];

  return {
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: booking.total_price,
    status: booking.status,
  };
};

export const markBookingReturnedInDB = async (bookingId: number) => {
  // 1. Update booking status
  const bookingQuery = `
    UPDATE bookings
    SET status = 'returned'
    WHERE id = $1
    RETURNING *;
  `;

  const bookingRes = await pool.query(bookingQuery, [bookingId]);
  const booking = bookingRes.rows[0];

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 2. Vehicle → set available
  const vehicleQuery = `
    UPDATE vehicles
    SET availability_status = 'available'
    WHERE id = $1
    RETURNING availability_status;
  `;

  const vehicleRes = await pool.query(vehicleQuery, [booking.vehicle_id]);

  return {
    ...booking,
    vehicle: {
      availability_status: vehicleRes.rows[0].availability_status,
    },
  };
};

// For cron
export const autoReturnExpiredBookingsInDB = async () => {
  const query = `
    UPDATE bookings
    SET status = 'returned'
    WHERE status = 'active'
    AND rent_end_date <= NOW()
    RETURNING *;
  `;

  const result = await pool.query(query);
  return result.rows;
};
