import { pool } from "../../config/db";

export const createVehicleInDB = async (payload: Record<string, unknown>) => {
  const result = await pool.query(
    "INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      payload.vehicle_name,
      payload.type,
      payload.registration_number,
      payload.daily_rent_price,
      payload.availability_status,
    ]
  );
  return result;
};
