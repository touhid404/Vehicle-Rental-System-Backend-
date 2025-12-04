import express from "express";
import { createVehicle, getAllVehicles } from "./vehicles.controller";
import { authMiddleware } from "../../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware("admin"), createVehicle);
router.get("/", getAllVehicles);

export const vehiclesRoutes = router;
