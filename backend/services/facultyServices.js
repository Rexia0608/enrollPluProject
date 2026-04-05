const fetchReviewQueueServices = (passData) => {
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
            ON cr.user_id = u.id  
        JOIN courses c 
            ON ep.course_code_id = c.id
        JOIN academic_year ay 
            ON ep.enrollment_year_code = ay.id
        WHERE ep.enrollment_year_code = $1
        AND ep.enrollment_status = 'documents_review';
        `;

    return { query, value };
  } catch (error) {
    console.error("fetchReviewQueue error:", error);
    throw error;
  }
};

const documentReviewServices = (data) => {
  try {
    let queries = [];
    let values = [];

    if (data.status) {
      // for test documents_review | payment_pending
      queries.push(`
        UPDATE enrollment_profile
        SET enrollment_status = 'documents_review' 
        WHERE enrollment_id = $1 
        AND user_id = $2
        RETURNING *;
      `);

      values.push([data.fileId, data.studentId]);

      message = `sample message proceed to payment`;
    } else {
      queries.push(`
        DELETE FROM transaction_table
        WHERE enrollment_id = $1
        RETURNING *;
      `);

      queries.push(`
        DELETE FROM enrollment_profile
        WHERE enrollment_id = $1
        RETURNING *;
      `);

      values.push([data.fileId]);
      values.push([data.fileId]);
    }

    return { queries, values };
  } catch (error) {
    console.error("Document Review Services error:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

const activeSemesterServices = async () => {
  try {
    let querySemester = `SELECT id FROM academic_year WHERE enrollment_open = 'true' LIMIT 1;`;
    return { querySemester };
  } catch (error) {
    console.error("error activeSemesterServices:", error);
    throw error;
  }
};

export {
  fetchReviewQueueServices,
  documentReviewServices,
  activeSemesterServices,
};
