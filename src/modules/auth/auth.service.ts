import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../../config";

export const createUserInDB = async (payload: Record<string, unknown>) => {
  const hashedPassword = await bcrypt.hash(payload.password as string, 10);
  
  const result = await pool.query(
    "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [payload.name, payload.email, hashedPassword, payload.phone, payload.role]
  );

  return result;
};

export const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }

  const secrect = config.jwtSecret;

  const token = jsonwebtoken.sign(
    { id: user.id, email: user.email, role: user.role },
    secrect,
    {
      expiresIn: "1d",
    }
  );
  if (user.password) delete user.password;

  return { token, user };
};
