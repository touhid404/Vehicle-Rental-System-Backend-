import express from "express";

import {
  deleteUserById,
  getAllUsers,  // getUserById,
  updateUserById,
} from "./user.controller";
import { authMiddleware } from "../../middleware/auth";
const router = express.Router();

router.get("/", getAllUsers);
// router.get("/:id", getUserById);
router.put("/:userId", authMiddleware("admin", "customer"), updateUserById);
router.delete("/:id", deleteUserById);

export const usersRoutes = router;
