import cron from "node-cron";
import { autoReturnExpiredBookingsInDB } from "../modules/booking/booking.service";

export const startAutoReturnCron = () => {
  // Runs every 1 minute
  cron.schedule("*/1 * * * *", async () => {
    try {
      const updated = await autoReturnExpiredBookingsInDB();
      if (updated.length > 0) {
        console.log(`Auto-returned ${updated.length} bookings`);
      } else {
        console.log("No expired bookings found.");
      }
    } catch (error: any) {
      console.error("Cron Job Error:", error);
    }
  });
};
