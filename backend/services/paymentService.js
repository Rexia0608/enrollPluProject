import { sendEmail } from "../utils/mailer.js";

const paymentUpdateService = (data) => {
  try {
    const { promiseNote, paymentDetails, user } = data;
    let query;
    let value;
    let paid;

    if (promiseNote.promiseStatus) {
      paid = true;
      query = `UPDATE transaction_table
                SET
                    remarks = $1,
                    payment_status = 'review'
                WHERE 
                    enrollment_id = $2
                    AND period = $3
                RETURNING *;
                `;
      value = [promiseNote, user.activeEnrollmentId, paymentDetails.period];
      return { query, value, paid };
    }

    if (!promiseNote.promiseStatus) {
      paid = false;
      query = `UPDATE transaction_table
                SET 
                    payment_status = 'review',
                    paid_amount = $1,
                    payment_per_period = payment_per_period - $2,
                    payment_type = $3
                WHERE enrollment_id = $4
                AND period = $5
                RETURNING *;
                `;
      value = [
        paymentDetails.amount,
        paymentDetails.amount,
        paymentDetails.paymentMethod,
        user.activeEnrollmentId,
        paymentDetails.period,
      ];

      return { query, value, paid };
    }
  } catch (error) {
    console.error("setPayment error:", error);
    throw error;
  }
};

const paymentPeriodService = (data) => {
  const { period, balance, paid_amount, enrollment_id } = data;

  const roundToTwoDecimals = (value) => parseFloat(value.toFixed(2));

  const periods = ["enrollment", "prelim", "mid-term", "pre-final", "final"];

  let nextBalance = roundToTwoDecimals(balance - paid_amount);
  if (nextBalance < 0) nextBalance = 0;

  const currentIndex = periods.indexOf(period);
  let nextPeriod = period;
  let remainingPeriods = 1;

  if (currentIndex >= 0 && currentIndex < periods.length - 1) {
    nextPeriod = periods[currentIndex + 1];
    remainingPeriods = periods.length - (currentIndex + 1);
  }

  // Compute next payment
  let nextPayment =
    remainingPeriods > 0
      ? roundToTwoDecimals(nextBalance / remainingPeriods)
      : 0;

  // Prepare SQL query
  const nextQuery = `
    UPDATE transaction_table
    SET 
        payment_status = CASE 
            WHEN $1 <= 0 THEN 'paid'
            ELSE 'pending'
        END,
        balance = $1::NUMERIC,
        payment_per_period = CASE 
            WHEN $1 <= 0 THEN 0
            ELSE $2::NUMERIC
        END
    WHERE enrollment_id = $3
    AND period = $4;
  `;

  // Ensure numeric types for PostgreSQL
  const nextValue = [
    roundToTwoDecimals(nextBalance),
    roundToTwoDecimals(nextPayment),
    enrollment_id,
    nextPeriod,
  ];

  return { nextQuery, nextValue };
};

const paymentService = async (queryData, isthisPartial, data) => {
  try {
    if (isthisPartial) {
      const response = {
        next_steps: {
          message: `We are in the process of review for your promised note. Once the faculty approves, the partial permit will be sent via email. Kindly check your email for updates.`,
          requires_approval: true,
          approval_timeframe: "2-3 business days",
        },
      };
      await sendEmail(
        "promised-note-validation",
        data.user.email,
        response.next_steps.message,
      );
      return response;
    }

    if (!isthisPartial) {
      const response = {
        next_steps: {
          message: `We are in the process of validating your ${queryData.period} payment. Once the faculty approves, the permit will be sent via email. Kindly check your email for updates.`,
          requires_approval: true,
          approval_timeframe: "2-3 business days",
        },
      };
      await sendEmail(
        "payment-validation",
        data.user.email,
        response.next_steps.message,
      );
      return response;
    }
  } catch (error) {
    console.error("setPayment error:", error);
    throw error;
  }
};

export { paymentPeriodService, paymentUpdateService, paymentService };
