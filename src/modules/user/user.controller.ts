import { Request, Response } from "express";
import { pool } from "../../config/db";



export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({ success: true, users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, age=$3, phone=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *`,
      [name, email, age, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};
