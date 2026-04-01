import db from "../config/db.js";
import { fetchReviewQueue } from "../services/reviewQueueServices.js";
import documentReviewServices from "../services/DocumentReviewServices.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//
const getReviewQueueModel = async () => {
  try {
    const activeSemester = await db.query(
      `SELECT ID FROM academic_year WHERE enrollment_open = 'true' LIMIT 1;`,
    );
    const { query, value } = await fetchReviewQueue(activeSemester.rows[0].id);
    const fetchQueueItems = await db.query(query, value);

    const data = fetchQueueItems.rows;
    return data;
  } catch (error) {
    console.error("Error in getReviewQueueModel:", error);
    throw new Error(
      `Failed to fetch get Check Review Student Queue: ${error.message}`,
    );
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

const postVerifiedDocumentModel = async (passData) => {
  try {
    const { queries, values, message } = await documentReviewServices(passData);

    await db.query("BEGIN");

    let data;

    for (let i = 0; i < queries.length; i++) {
      data = await db.query(queries[i], values[i]);
    }

    await db.query("COMMIT");

    return data.rows[0];
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error inpatchVerifiedDocumentModel:", error);
    throw new Error(`Failed to process verified Document: ${error.message}`);
  }
};

export { getReviewQueueModel, postVerifiedDocumentModel };
