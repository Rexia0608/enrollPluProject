import db from "../config/db.js";
import { fetchReviewQueue } from "../services/reviewQueueServices.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

const getReviewQueueModel = async () => {
  try {
    const activeSemester = await db.query(
      `SELECT ID FROM academic_year WHERE enrollment_open = 'true' LIMIT 1;`,
    );

    const fetchQueueItems = await db.query(
      `SELECT 
            ep.enrollment_id,
            ep.enrollment_status,
            ep.student_type,
            ep.year_level,
            u.id AS user_id,
            u.first_name,
            u.last_name,
            c.course_code,
            c.course_name,
            cr.email,
            ay.year_series,
            ay.semester
        FROM enrollment_profile ep
        JOIN users u 
            ON ep.user_id = u.id
        JOIN credentials cr 
            ON cr.user_id = u.id   -- or ep.user_id (same result)
        JOIN courses c 
            ON ep.course_code_id = c.id
        JOIN academic_year ay 
            ON ep.enrollment_year_code = ay.id
        WHERE ep.enrollment_year_code = $1;
        `,
      [activeSemester.rows[0].id],
    );

    const data = fetchQueueItems.rows;

    return data;
  } catch (error) {
    console.error("Error in getReviewQueueModel:", error);
    throw new Error(
      `Failed to fetch get Check Review Student Queue: ${error.message}`,
    );
  }
};

export { getReviewQueueModel };
