import express from "express";
import { createBooking, getAllBookings, updateBooking } from "./booking.controller";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();


// Protected routes - only for admin,customer
// Ok Checked
router.post("/",authMiddleware('admin','customer'),createBooking);
// All ok checked
router.get("/", authMiddleware('admin','customer'), getAllBookings);
// OK
router.put("/:bookingId", authMiddleware('admin','customer'), updateBooking);
 // TODO : create a route that auto 
export const bookingsRoutes = router;
