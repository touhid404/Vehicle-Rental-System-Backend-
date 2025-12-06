import express from "express";
import {signin, signup } from "./auth.controller";


const router = express.Router();

// Ok checked
router.post("/signup", signup);
// Ok checked
router.post("/signin", signin);

export const authRoutes = router;
