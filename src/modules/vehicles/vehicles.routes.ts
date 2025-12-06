import express from "express";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
} from "./vehicles.controller";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();
// Ok checked
// Public for everyone
router.get("/", getAllVehicles);
router.get("/:vehicleId", getVehicleById);
// Ok checked
// Protected routes - only for admin
router.post("/", authMiddleware("admin"), createVehicle);
router.put("/:vehicleId", authMiddleware("admin"), updateVehicle);
router.delete("/:vehicleId", authMiddleware("admin"), deleteVehicle);

export const vehiclesRoutes = router;
