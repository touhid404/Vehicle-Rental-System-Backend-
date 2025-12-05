import { Request, Response } from "express";
import { pool } from "../../config/db";
import { updateUserService } from "./user.service";

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

// export const getUserById = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({ success: true, user: result.rows[0] });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching user",
//     });
//   }
// };

// export const updateUserById = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const { name, email, phone, role } = req.body;

//   const userIdFromToken = req.user?.id;
//   const userRoleFromToken = req.user?.role;

//   try {
//     // 1. Check if target user exists
//     const targetUser = await pool.query("SELECT * FROM users WHERE id=$1", [
//       userId,
//     ]);

//     if (targetUser.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const existing = targetUser.rows[0];

//     // 2. Role-based access control
//     if (userRoleFromToken !== "admin" && Number(userId) !== userIdFromToken) {
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden: You can only update your own profile",
//       });
//     }
//     let finalRole = existing.role;

//     // Admin can update role
//     if (userRoleFromToken === "admin" && role) {
//       finalRole = role;
//     }

//     // Non-admin users CANNOT change role
//     if (userRoleFromToken !== "admin" && role) {
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden: You cannot change your role",
//       });
//     }

//     // 4. Update user with fallback to existing values
//     const updatedUser = await pool.query(
//       `UPDATE users
//        SET name=$1, email=$2, phone=$3, role=$4
//        WHERE id=$5
//        RETURNING id, name, email, phone, role`,
//       [
//         name || existing.name,
//         email || existing.email,
//         phone || existing.phone,
//         finalRole,
//         userId,
//       ]
//     );

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser.rows[0],
//     });
//   } catch (error: any) {
//     console.error("Update error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };



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
