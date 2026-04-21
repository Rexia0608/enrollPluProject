import authCodeGenerator from "../utils/AuthCodeGenerator.js";
import { sendEmail } from "../utils/mailer.js";

//++++++++++++++++++ need to refactor +++++++++++++++++++//
const updateCredentialsServices = (id, data) => {
  try {
    let query = `
      UPDATE users 
      SET 
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
      `;
    let values = [data.status, id];
    return { query, values };
  } catch (error) {
    console.error("error updateStatusServices:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

const AcademicYearExistingServices = (data) => {
  try {
    let queryrExisting = `SELECT id 
       FROM academic_year 
       WHERE year_series = $1 AND semester = $2`;
    let valuesrExisting = [data.year_series, data.semester];
    return { queryrExisting, valuesrExisting };
  } catch (error) {
    console.error("Templated error:", error);
    throw error;
  }
};

const getAllUsersListServices = () => {
  try {
    const query = `SELECT 
    users.id,
    users.first_name,
    users.last_name,
    credentials.email,
    users.role,
    users.status,
    credentials.created_at
FROM credentials
INNER JOIN users
    ON credentials.user_id = users.id;`;
    return { query };
  } catch (error) {
    console.error("getAllUsersListServices error:", error);
    throw error;
  }
};

const getAcademicServices = () => {
  try {
    let query = `SELECT id, year_series, semester, start_date, end_date, is_class_ongoing, enrollment_open FROM academic_year`;
    return { query };
  } catch (error) {
    console.error("getAcademicServices error:", error);
    throw error;
  }
};

const getAllCoursesListServices = () => {
  try {
    let query = `SELECT * FROM courses`;
    return { query };
  } catch (error) {
    console.error("getAllCoursesListSerivces error:", error);
    throw error;
  }
};

const updateCoursesServices = (id, data) => {
  try {
    let query = `
      UPDATE courses 
      SET 
        course_code = $1, 
        course_name = $2, 
        duration_type = $3, 
        tuition_fee = $4, 
        course_status = $5, 
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
      `;
    let values = [
      data.course_code,
      data.course_name,
      data.duration_type,
      data.tuition_fee,
      data.course_status,
      id,
    ];

    return { query, values };
  } catch (error) {
    console.error("updateCoursesServices error:", error);
    throw error;
  }
};

const updateUserServices = (id, data) => {
  try {
    let query = `
      UPDATE users
      SET 
        first_name = $1,
        last_name = $2,
        role = $3,
        status = $4
      WHERE 
        id = $5
      RETURNING *;
    `;
    let values = [
      data.first_name,
      data.last_name,
      data.role,
      data.status,
      id.user_id,
    ];
    return { query, values };
  } catch (error) {
    console.error("error updateUserServices:", error);
    throw error;
  }
};

const postNewCoursesServices = (data) => {
  try {
    let query = `
      INSERT INTO courses (
        course_code,
        course_name,
        duration_type,
        tuition_fee,
        course_status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
      `;
    let values = [
      data.course_code,
      data.course_name,
      data.duration_type,
      data.tuition_fee,
      data.course_status,
    ];
    return { query, values };
  } catch (error) {
    console.error("postNewCoursesServices error:", error);
    throw error;
  }
};

const deleteCoursesServices = (id) => {
  try {
    let query = `
      DELETE FROM courses 
      WHERE id = $1
      RETURNING *;
      `;
    let values = [id];
    return { query, values };
  } catch (error) {
    console.error("deleteCoursesServices error:", error);
    throw error;
  }
};

const postAcademicYearModelServices = (data) => {
  try {
    let query = `INSERT INTO academic_year 
       (year_series, semester, start_date, end_date, is_class_ongoing, enrollment_open)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`;
    let values = [
      data.year_series,
      data.semester,
      data.start_date,
      data.end_date,
      true,
      data.enrollment_open ?? false,
    ];
    return { query, values };
  } catch (error) {
    console.error("error postAcademicYearModelServices:", error);
    throw error;
  }
};

const updateStatusCloseAllAcademicYearServices = (id) => {
  try {
    let query = `UPDATE academic_year 
         SET enrollment_open = false, updated_at = NOW()
         WHERE id != $1;`;
    let values = [id];
    return { query, values };
  } catch (error) {
    console.error("error updateStatusCloseAllAcademicYearServices:", error);
    throw error;
  }
};

const updateStatusAcademicYearServices = (data, id) => {
  try {
    let query = `UPDATE academic_year
       SET enrollment_open = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *;`;
    let values = [data, id];
    return { query, values };
  } catch (error) {
    console.error("error updateStatusAcademicYearServices:", error);
    throw error;
  }
};

const updateClassCloseStatusAcademicYearServices = (id) => {
  try {
    let query = `UPDATE academic_year 
         SET is_class_ongoing = false, updated_at = NOW()
         WHERE id != $1;`;
    let values = [id];
    return { query, values };
  } catch (error) {
    console.error("error updateClassCloseStatusAcademicYearServices:", error);
    throw error;
  }
};

const updateClassStatusAcademicYearServices = (passData, id) => {
  try {
    let queryClose = `UPDATE academic_year
       SET is_class_ongoing = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *;`;
    let valuesClose = [passData, id];
    return { queryClose, valuesClose };
  } catch (error) {
    console.error("error updateClassStatusAcademicYearServices:", error);
    throw error;
  }
};

const updateSemesterServices = (id, data) => {
  console.log(data);
  try {
    let query = `UPDATE academic_year
                SET 
                  year_series = $1,
                  semester = $2, 
                  start_date = $3,
                  end_date = $4
                WHERE 
                  id = $5
                RETURNING *;
    `;
    let values = [
      data.year_series,
      data.semester,
      data.start_date,
      data.end_date,
      id,
    ];
    return { query, values };
  } catch (error) {
    console.error("error updateSemesterServices:", error);
    throw error;
  }
};

const updatePasswordServices = async (passData) => {
  try {
    const { otpExpires } = await authCodeGenerator();
    let query = `
      UPDATE credentials
      SET otp_expires_at = $1, 
      is_verified = $2
      WHERE user_id = $3
      RETURNING email; 
    `;
    let values = [otpExpires, false, passData.id];
    let message = `http://localhost:5173/password-reset/${passData.id}`;
    await sendEmail("password-reset", passData.email, message);
    return { query, values };
  } catch (error) {
    console.error("error updatePasswordServices:", error);
    throw error;
  }
};

const getOverViewServices = async () => {
  try {
    let query = `
    SELECT
    (SELECT COUNT(*)::TEXT 
     FROM users 
     WHERE role = 'student'
     AND status = true
     ) AS total_students,

    (SELECT COUNT(*)::TEXT 
     FROM enrollment_profile 
     WHERE enrollment_status = 'documents_review') AS pending_documents,

    (SELECT COUNT(*)::TEXT 
     FROM transaction_table 
     WHERE payment_status = 'review') AS pending_payments,

    (SELECT COUNT(*)::TEXT 
     FROM enrollment_profile 
     WHERE enrollment_status = 'enrolled') AS enrolled_students;
    `;

    return { query };
  } catch (error) {
    console.error("error getOverViewTestServices:", error);
    throw error;
  }
};

const getOverViewFormatServices = (passData) => {
  try {
    const data = [
      {
        title: "Total Student",
        value: passData[0].total_students,
        change: 12,
        icon: "Users",
        color: "blue",
      },
      {
        title: "Pending Documents",
        value: passData[0].pending_documents,
        change: -5,
        icon: "FileText",
        color: "yellow",
      },
      {
        title: "Pending Payments",
        value: passData[0].pending_payments,
        change: 8,
        icon: "CreditCard",
        color: "red",
      },
      {
        title: "Enrolled Students",
        value: passData[0].enrolled_students,
        change: 15,
        icon: "CheckCircle",
        color: "green",
      },
    ];
    return data;
  } catch (error) {
    console.error("error getOverViewFormatServices:", error);
    throw error;
  }
};

const getEnrollmentTrendServices = async () => {
  try {
    let query = `
    SELECT 
    ay.year_series,
    ay.semester,
        COUNT(ep.enrollment_id) AS total_enrollees
    FROM enrollment_profile ep
    JOIN academic_year ay
        ON ep.enrollment_year_code = ay.id
    WHERE ep.enrollment_status = 'enrolled'
    GROUP BY ay.year_series, ay.semester
    ORDER BY ay.year_series ASC, ay.semester ASC;
    `;

    return { query };
  } catch (error) {
    console.error("error getEnrollmentTrendService:", error);
    throw error;
  }
};

const getIncomeOverviewServices = async () => {
  try {
    let query = `
            SELECT 
            t.period,
            SUM(t.paid_amount) AS amount
        FROM transaction_table t
        JOIN enrollment_profile ep
            ON t.enrollment_id = ep.enrollment_id
        JOIN academic_year ay
            ON ep.enrollment_year_code = ay.id
        WHERE 
            ay.enrollment_open = true
            AND t.payment_status = 'paid'
        GROUP BY t.period
        ORDER BY 
            CASE t.period
                WHEN 'enrollment' THEN 1
                WHEN 'prelim' THEN 2
                WHEN 'mid-term' THEN 3
                WHEN 'pre-final' THEN 4
                WHEN 'final' THEN 5
                WHEN 'summer' THEN 6
            END;
    `;
    return { query };
  } catch (error) {
    console.error("error getincomeOverviewServices:", error);
    throw error;
  }
};

const getPaymentProgressServices = async () => {
  try {
    let query = `
        SELECT 
            SUM(t.paid_amount) AS total_paid,
            SUM(t.payment_per_period) AS total_expected,
            ROUND(
                (SUM(t.paid_amount) / NULLIF(SUM(t.payment_per_period), 0)) * 100,
                2
            ) AS progress_percentage
        FROM transaction_table t
        JOIN enrollment_profile ep
            ON t.enrollment_id = ep.enrollment_id
        JOIN academic_year ay
            ON ep.enrollment_year_code = ay.id
        WHERE 
            ay.enrollment_open = true;
    `;
    return { query };
  } catch (error) {
    console.error("error getincomeOverviewServices:", error);
    throw error;
  }
};

const getEnrollmentFunnelServices = async () => {
  try {
    let query = `
            SELECT 
            stage,
            COUNT(*) AS total
        FROM (
            SELECT 
                CASE 
                    WHEN ep.enrollment_status IN (
                        'documents_pending',
                        'documents_review',
                        'documents_approved'
                    ) THEN 'Documents'

                    WHEN ep.enrollment_status IN (
                        'payment_pending',
                        'payment_validated'
                    ) THEN 'Payment'

                    WHEN ep.enrollment_status = 'enrolled'
                    THEN 'Enrolled'
                END AS stage
            FROM enrollment_profile ep
            JOIN academic_year ay
                ON ep.enrollment_year_code = ay.id
            WHERE ay.enrollment_open = true
        ) sub
        WHERE stage IS NOT NULL
        GROUP BY stage
        ORDER BY 
            CASE stage
                WHEN 'Documents' THEN 1
                WHEN 'Payment' THEN 2
                WHEN 'Enrolled' THEN 3
            END;
    `;

    return { query };
  } catch (error) {
    console.error("error getenrollmentFunnelServices:", error);
    throw error;
  }
};

const getTopCoursesServices = async () => {
  try {
    let query = `
      SELECT 
          c.course_name,
          COUNT(ep.enrollment_id) AS total_enrollees
      FROM enrollment_profile ep
      JOIN courses c
          ON ep.course_code_id = c.id
      JOIN academic_year ay
          ON ep.enrollment_year_code = ay.id
      WHERE 
          ay.enrollment_open = true
          AND ep.enrollment_status = 'enrolled' -- optional but recommended
      GROUP BY c.course_name
      ORDER BY total_enrollees DESC
      LIMIT 5;
    `;

    return { query };
  } catch (error) {
    console.error("error getenrollmentFunnelServices:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ test here +++++++++++++++++++//

const Templated = async () => {
  try {
    let query = ``;
    let values = [];
    return { query, values };
  } catch (error) {
    console.error("error Templated:", error);
    throw error;
  }
};

//++++++++++++++++++ test here +++++++++++++++++++//

//++++++++++++++++++ helper Query here +++++++++++++++++++//
const findUserQueryServices = (id) => {
  try {
    let query = `SELECT 
                  u.id,
                  u.first_name,
                  u.last_name,
                  u.role,
                  u.status,
                  u.created_at,
                  u.updated_at,
                  c.email,
                  c.password,
                  c.mobile_number,
                  c.is_verified,
                  c.login_attempts,
                  c.created_at AS credentials_created_at,
                  c.updated_at AS credentials_updated_at
              FROM users u
              JOIN credentials c 
                  ON u.id = c.user_id
              WHERE u.id = $1`;
    let value = [id];

    return { query, value };
  } catch (error) {
    console.error("Error in findUserQueryServices:", error);
    throw error;
  }
};
//++++++++++++++++++ helper Query here +++++++++++++++++++//

export {
  getTopCoursesServices,
  getEnrollmentFunnelServices,
  getPaymentProgressServices,
  getIncomeOverviewServices,
  getEnrollmentTrendServices,
  getOverViewFormatServices,
  updateClassCloseStatusAcademicYearServices,
  updateStatusCloseAllAcademicYearServices,
  updateClassStatusAcademicYearServices,
  updateStatusAcademicYearServices,
  postAcademicYearModelServices,
  AcademicYearExistingServices,
  updateCredentialsServices,
  updatePasswordServices,
  deleteCoursesServices,
  postNewCoursesServices,
  getAcademicServices,
  updateUserServices,
  getOverViewServices,
  getAllUsersListServices,
  getAllCoursesListServices,
  updateCoursesServices,
  updateSemesterServices,
  findUserQueryServices,
};
