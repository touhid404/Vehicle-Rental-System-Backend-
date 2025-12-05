import express from "express";
import { createBooking, getAllBookings } from "./booking.controller";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();


// Protected routes - only for admin,customer
router.post("/",createBooking);
router.get("/", authMiddleware('admin','customer'), getAllBookings);

    
export const bookingsRoutes = router;
