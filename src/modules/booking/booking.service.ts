import { pool } from "../../config/db";

export const createBookingInDB = async (payload: Record<string, unknown>) => {
  const query = `
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

  const bookingResult = await pool.query(query, values);
  const booking = bookingResult.rows[0];

  // Fetch vehicle and join manually
  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price
     FROM vehicles
     WHERE id = $1`,
    [payload.vehicle_id]
  );

  const vehicle = vehicleResult.rows[0];

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
}
export const getAllBookingsOfCustomerDB = async (customerId: number) => {
  const result = await pool.query("SELECT * FROM bookings WHERE customer_id = $1", [customerId]);
  return result.rows;
}


