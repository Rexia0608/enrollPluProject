import cron from "node-cron";

import { paymentReminderModel } from "../models/automationModel.js";

// minute hour day month weekday
//   0     8    *    *      *

// "*/5 * * * * *"
cron.schedule(
  "0 0 10 * * *",
  async () => {
    try {
      console.log("📅 Running payment automation...");
      await paymentReminderModel();
    } catch (err) {
      console.error("❌ Automation error:", err);
    }
  },
  {
    timezone: "Asia/Manila",
  },
);
