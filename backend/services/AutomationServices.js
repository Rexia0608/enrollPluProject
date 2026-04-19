import { sendEmail } from "../utils/mailer.js";

const paymentReminderServices = async () => {
  try {
    let queries = [];

    queries.push(
      `
        SELECT 
          t.id,
          t.enrollment_id,
          t.period,
          t.payment_status,
          t.remarks,
          t.updated_at,
          t.payment_per_period,

          ay.semester,
          ay.year_series,
          ay.is_class_ongoing,

          c.email

      FROM transaction_table t

      JOIN enrollment_profile e 
          ON t.enrollment_id = e.enrollment_id

      JOIN academic_year ay 
          ON e.enrollment_year_code = ay.id

      JOIN credentials c 
          ON e.user_id = c.user_id

      WHERE 
          ay.is_class_ongoing = true
          AND t.payment_status = 'pending'
          AND t.remarks IS NOT NULL
          AND t.paid_amount = 0; 
    `,
    );

    return queries;
  } catch (error) {
    console.error("Error in  paymentReminderService:", error);
    throw error;
  }
};

const reminderServices = async (passData) => {
  try {
    let message = `Good day.

    This is a reminder regarding your ${passData.semester} (${passData.year_series}).

    We noticed an unpaid ${passData.period} payment with a remaining balance of ₱${passData.payment_per_period}.

    As per your record, you previously indicated that you will settle this on ${new Date(passData.remarks.date).toLocaleDateString()}.

    Please disregard this message if payment has already been made.

    Reference: ${passData.id}`;

    sendEmail("promissory-reminder", passData.email, message);
  } catch (error) {
    console.error("Error in addDateReminderServices:", error);
    throw error;
  }
};

export { paymentReminderServices, reminderServices };
