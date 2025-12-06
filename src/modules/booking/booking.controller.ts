import { Request, Response } from "express";
import {
  checkBookingStartDate,
  checkVehicleAvailability,
  createBookingInDB,
  getAllBookingsFromDB,
  getAllBookingsOfCustomerDB,
  updateBookingsInDB,
} from "./booking.service";
import { pool } from "../../config/db";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if customer ID matches token ID
    if (req.user?.id !== customer_id) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to create a booking for another customer",
      });
    }

    // 1. Check vehicle availability
    const vehicleAvailable = await checkVehicleAvailability(vehicle_id);

    if (vehicleAvailable.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available",
      });
    }

    const vehicle = vehicleAvailable.rows[0];

    // 2. Calculate total price
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);

    const days =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
      1;

    const totalPrice = days * vehicle.daily_rent_price;

    // 3. Create booking in DB
    const result = await createBookingInDB({
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price: totalPrice,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    if (role === "customer") {
      const customerId = req.user?.id;
      const getBookings = await getAllBookingsOfCustomerDB(customerId);
      return res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: getBookings,
      });
    } else if (role === "admin") {
      const bookings = await getAllBookingsFromDB();
      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings,
      });
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const status = req.body.status;
    const getRole = req.user?.role;
    const userIdFromToken = req.user?.id;
    if (getRole === "customer") {
      // Check if Booking start date is in future
      const bookingResult = await checkBookingStartDate(Number(bookingId));
      const currentDate = new Date();

      // Date format 2024-01-05 in Db
      const bookingStartDate = new Date(bookingResult.rent_start_date);
      if (bookingStartDate <= currentDate) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel booking that has already started or passed",
        });
      }
      

      // const result = await updateBookingsInDB(bookingId, status, userIdFromToken, getRole);
    }
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
