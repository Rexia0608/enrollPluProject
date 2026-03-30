const fetchReviewQueue = async (passData) => {
  try {
    const value = [passData];
    const query = `SELECT 
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
        `;

    return { query, value };
  } catch (error) {
    console.error("fetchReviewQueue error:", error);
    throw error;
  }
};

export { fetchReviewQueue };
