import { pool } from "../../config/db";

export const updateUserService = async (
  userId: number,
  payload: { name?: string; email?: string; phone?: string; role?: string },
  userFromToken: { id: number; role: string }
) => {
  const { name, email, phone, role } = payload;
  const { id: userIdFromToken, role: userRoleFromToken } = userFromToken;

  // 1. Check if target user exists
  const targetUser = await pool.query("SELECT * FROM users WHERE id=$1", [
    userId,
  ]);

  if (targetUser.rows.length === 0) {
    return { error: "User not found", status: 404 };
  }

  const existing = targetUser.rows[0];

  // 2. Role-based access
  if (userRoleFromToken !== "admin" && userId !== userIdFromToken) {
    return {
      error: "Forbidden: You can only update your own profile",
      status: 403,
    };
  }

  let finalRole = existing.role;

  // Admin can update role
  if (userRoleFromToken === "admin" && role) {
    finalRole = role;
  }

  // Non-admin cannot change role
  if (userRoleFromToken !== "admin" && role) {
    return { error: "Forbidden: You cannot change your role", status: 403 };
  }

  // 3. Update user
  const updatedUser = await pool.query(
    `UPDATE users
      SET name=$1, email=$2, phone=$3, role=$4
      WHERE id=$5
      RETURNING id, name, email, phone, role`,
    [
      name || existing.name,
      email || existing.email,
      phone || existing.phone,
      finalRole,
      userId,
    ]
  );

  return { data: updatedUser.rows[0] };
};

export const activeBookingsCheck = async (userId: number) => {
  return await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );
};

export const deleteUserService = async (userId: number) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [userId]
  );

  if (result.rows.length === 0) {
    return { error: "User not found", status: 404 };
  }

  return { data: result.rows[0] };
};
