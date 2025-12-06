import { Request, Response } from "express";
import { pool } from "../../config/db";
import { activeBookingsCheck, deleteUserService, updateUserService } from "./user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email,  phone, role FROM users"
    );
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    const result = await updateUserService(
      userId,
      req.body,
      { id: req.user?.id, role: req.user?.role } // token user info
    );

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.data,
    });
  } catch (err: any) {
    console.error("Update error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    // Check user active bookings availability
    const bookingCheck = await activeBookingsCheck(userId);
    if (bookingCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user: Active bookings found",
      });
    }

    const result = await deleteUserService(userId);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
