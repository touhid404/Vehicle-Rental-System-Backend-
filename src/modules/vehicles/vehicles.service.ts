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

export const updateVehicleInDB = async (
  vehicleId: number,
  updateData: Record<string, unknown>
) => {
  const allowedFields = [
    "vehicle_name",
    "type",
    "registration_number",
    "daily_rent_price",
    "availability_status",
  ];

  const updates: string[] = [];
  const values: any[] = [];
  let index = 1;

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updates.push(`${field} = $${index}`);
      values.push(updateData[field]);
      index++;
    }
  }

  if (updates.length === 0) {
    return { error: "No fields provided for update" };
  }

  values.push(vehicleId);

  const query = `
    UPDATE vehicles 
    SET ${updates.join(", ")} 
    WHERE id = $${index}
    RETURNING *;
  `;

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};
