import { Request, Response } from "express";
import { createVehicleInDB } from "./vehicles.service";
import { pool } from "../../config/db";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    if (
      !req.body.vehicle_name ||
      !req.body.type ||
      !req.body.registration_number ||
      !req.body.daily_rent_price ||
      !req.body.availability_status
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (req.body.daily_rent_price <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "daily_rent_price must be positive" });
    }

    const result = await createVehicleInDB(req.body);
    const vehicle = result.rows[0];

    if (vehicle.password) delete vehicle.password;
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Error inserting vehicle:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles");
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No vehicles found",
        });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result.rows,
      });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
