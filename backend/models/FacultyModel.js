import db from "../config/db.js";
import { fetchReviewQueue } from "../services/reviewQueueServices.js";

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

export { getReviewQueueModel };
