import express, { Request, Response } from "express";
import config from "./config";
import { initDB, pool } from "./config/db";
import { usersRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./modules/booking/booking.routes";
import { startAutoReturnCron } from "./cron/autoReturn.cron";

const app = express();

// Middleware
app.use(express.json());

initDB();
// Home Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System Backend!");
});

// Auth Routes
app.use("/api/v1/auth", authRoutes);
// Vehicle Routes
app.use("/api/v1/vehicles", vehiclesRoutes);
// User Routes
app.use("/api/v1/users", usersRoutes);
// Booking Routes
app.use("/api/v1/bookings", bookingsRoutes);

app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "Route not found",
  });
});
// CRON jobs , runs every one minitue
startAutoReturnCron();
// Start Server
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
