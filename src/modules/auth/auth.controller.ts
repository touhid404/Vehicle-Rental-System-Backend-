import { Request, Response } from "express";
import { createUserInDB, loginUser } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.role
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const result = await createUserInDB(req.body);
    const user = result.rows[0];

    if (user.password) delete user.password;
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);

    if (!result) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Login successful", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
