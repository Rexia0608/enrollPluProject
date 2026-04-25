import db from "../config/db.js";

import {
  paymentReminderServices,
  reminderServices,
} from "../services/AutomationServices.js";

const paymentReminderModel = async () => {
  try {
    const queries = await paymentReminderServices();
    const automationSwitch = await db.query(queries[0]);
    let dueDate = new Date(automationSwitch.rows[0].remarks.date);
    let now = new Date();
    console.log(automationSwitch.rows.length > 0 && now >= dueDate);
    if (automationSwitch.rows.length > 0 && now >= dueDate) {
      await reminderServices(automationSwitch.rows[0]);
      console.log(
        `were able to send a reminder for ${automationSwitch.rows[0].email}.`,
      );
    }

    console.log(`No pending payment under automation student.`);
  } catch (error) {
    console.error("Error in switchStatusMode:", error);
    throw error;
  }
};

export { paymentReminderModel };
