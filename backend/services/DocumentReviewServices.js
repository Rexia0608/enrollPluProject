const documentReviewServices = async (data) => {
  try {
    let queries = [];
    let values = [];
    let message;

    if (data.status) {
      queries.push(`
        UPDATE enrollment_profile
        SET enrollment_status = 'payment_pending'
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

      message = `document are rejected due to the following reason: ${data.feedback}`;
    }

    return { queries, values, message };
  } catch (error) {
    console.error("Document Review Services error:", error);
    throw error;
  }
};

export default documentReviewServices;
