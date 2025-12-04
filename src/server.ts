import express, { Request, Response } from "express";
import config from "./config";
import { initDB, pool } from "./config/db";
import { usersRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";


const app = express();

// Middleware
app.use(express.json());

initDB();
// Home Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Vehicle Rental System Backend!");
});


app.use('/api/v1/auth',authRoutes);
// app.use('/users',usersRoutes);

app.use((req,res)=>{

  res.status(404).send({
    success:false,
    message:"Route not found"
  })

})

// Start Server
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
