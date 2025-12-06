import express from "express";
import { createBooking, getAllBookings, updateBooking } from "./booking.controller";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();


// Protected routes - only for admin,customer
router.post("/",authMiddleware('admin','customer'),createBooking);
router.get("/", authMiddleware('admin','customer'), getAllBookings);
router.put("/:bookingId", authMiddleware('admin','customer'), updateBooking);

    
export const bookingsRoutes = router;
