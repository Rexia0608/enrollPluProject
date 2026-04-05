import db from "../config/db.js";

import {
  fetchReviewQueueServices,
  documentReviewServices,
  activeSemesterServices,
} from "../services/facultyServices.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//
const getReviewQueueModel = async () => {
  try {
    const { querySemester } = await activeSemesterServices();
    const activeSemester = await db.query(querySemester);

    if (activeSemester.rows.length === 0) {
      return { error: "No Academic set yet by the Admin." };
    }

    const { query, value } = fetchReviewQueueServices(
      activeSemester.rows[0].id,
    );
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

const postVerifiedDocumentModel = async (passData) => {
  try {
    const { queries, values } = documentReviewServices(passData);

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

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here  +++++++++++++++++++//

const Templated = async () => {
  try {
  } catch (error) {
    console.error("error Templated:", error);
    throw error;
  }
};

//++++++++++++++++++ TEST here +++++++++++++++++++//

export {
  getReviewQueueModel,
  postVerifiedDocumentModel,
  activeSemesterServices,
};
