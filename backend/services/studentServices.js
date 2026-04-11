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
  enrollmentProfileServices,
  enrollmentTransactionServices,
  sendingEvaluationServices,
};
