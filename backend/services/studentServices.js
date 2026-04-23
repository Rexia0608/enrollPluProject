import { sendEmail } from "../utils/mailer.js";

//++++++++++++++++++ finalized here  +++++++++++++++++++//

const enrollmentTransactionServices = (tuition_fee, semester) => {
  try {
    let transactionQuery;

    let enrollmentFee;

    switch (semester) {
      case "Summer Class":
        enrollmentFee = tuition_fee;
        transactionQuery = `INSERT INTO transaction_table (
                            enrollment_id, 
                            period,
                            payment_status,
                            paid_amount,
                            balance,
                            payment_per_period
                        )
                        SELECT
                            $1 AS enrollment_id,
                            period,
                            'pending' AS payment_status,
                            0.00 AS paid_amount,
                            CASE WHEN period = 'summer' THEN $2 ELSE 0 END AS balance,
                            CASE WHEN period = 'summer' THEN $3 ELSE 0 END AS payment_per_period
                        FROM (VALUES ('summer')) AS periods(period);`;
        break;

      default:
        enrollmentFee = tuition_fee / 5;
        transactionQuery = `INSERT INTO transaction_table (
                              enrollment_id,
                              period,
                              payment_status,
                              paid_amount,
                              balance,
                              payment_per_period
                          )
                          SELECT
                              $1 AS enrollment_id,
                              period,
                              'pending' AS payment_status,
                              0.00 AS paid_amount,  
                              CASE WHEN period = 'enrollment' THEN $2 ELSE 0 END AS balance,
                              CASE WHEN period = 'enrollment' THEN $3 ELSE 0 END AS payment_per_period
                          FROM (VALUES
                              ('enrollment'),
                              ('prelim'),
                              ('mid-term'),
                              ('pre-final'),
                              ('final')
                          ) AS periods(period);`;
        break;
    }

    return { transactionQuery, enrollmentFee };
  } catch (error) {
    console.error("enrollmentTransactionServices error:", error);
    throw error;
  }
};

const enrollmentProfileServices = (data) => {
  try {
    const facultyDefaultValidation = {
      document: false,
      isProfileAreValidated: false,
      remarkNote:
        "This process typically takes 2–3 business days. You can check the status of your application anytime by logging into your account and always check your registered email for more update.",
    };

    const statusMap = {
      old_student: "payment_pending",
      new: "documents_review",
      transferee: "documents_review",
    };

    const enrollStatus = statusMap[data.studentType];

    const profileValue = [
      data.course,
      data.studentId,
      data.academicYearId,
      enrollStatus,
      data.studentType,
      data.yearLevel,
      JSON.stringify(facultyDefaultValidation),
    ];

    const profileQuery = `INSERT INTO enrollment_profile (
          course_code_id, user_id, enrollment_year_code, enrollment_status, student_type, year_level, remarks
        )
       SELECT $1, $2, $3, $4, $5, $6, $7::jsonb
       WHERE NOT EXISTS (
         SELECT 1 FROM enrollment_profile
         WHERE user_id = $2 AND enrollment_year_code = $3
       )
       RETURNING *;`;

    return { profileQuery, profileValue };
  } catch (error) {
    console.error("enrollmentServices error:", error);
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
                    payment_per_period = payment_per_period,
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
                     tracking_number = $3,
                     payment_type = $4
                WHERE 
                    enrollment_id = $5
                AND 
                    period = $6
                RETURNING *;
                `;
      value = [
        paymentDetails.amount,
        paymentDetails.amount,
        paymentDetails.referenceNumber,
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

//++++++++++++++++++ finalized here  +++++++++++++++++++//

/********************************* TEST HERES ****************************************/

const Templated = async () => {
  try {
  } catch (error) {
    console.error("error Templated:", error);
    throw error;
  }
};

/********************************* TEST HERES ****************************************/

//++++++++++++++++++ helper here +++++++++++++++++++//
const sendingEvaluationServices = async (type, emailaddress, message) => {
  try {
    await sendEmail(type, emailaddress, message);
  } catch (error) {
    console.error("error sendingEvaluationServices:", error);
    throw error;
  }
};
//++++++++++++++++++ helper here +++++++++++++++++++//

export {
  paymentService,
  paymentPeriodService,
  paymentUpdateService,
  enrollmentProfileServices,
  enrollmentTransactionServices,
  sendingEvaluationServices,
};
