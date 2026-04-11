import db from "../config/db.js";

import {
  postVerifiedPaymentServices,
  fetchReviewQueueServices,
  documentReviewServices,
  activeSemesterServices,
  getReviewQueuePaymentServices,
  confirmedServices,
  getValidateReceiptServices,
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

const getReviewQueuePaymentModel = async () => {
  try {
    const { query } = await getReviewQueuePaymentServices();
    const data = await db.query(query);
    return data.rows;
  } catch (error) {
    console.error("error getReviewQueuePaymentModel:", error);
    throw error;
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

const postVerifiedPaymentModel = async (passData) => {
  try {
    const { queries, values } = await postVerifiedPaymentServices(passData);
    let data;

    await db.query("BEGIN");

    for (let i = 0; i < queries.length; i++) {
      await db.query(queries[i], values[i]);
    }

    data = await db.query(queries[1], values[1]);

    await confirmedServices(data.rows[0], passData);
    await db.query("COMMIT");
    // return data.rows[0];
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("error postVerifiedPaymentModel:", error);
    throw error;
  }
};

const getValidateReceiptModel = async (passData) => {
  try {
    let data;

    const { query, value } = await getValidateReceiptServices(passData);
    data = await db.query(query, value);

    return data.rows[0];
  } catch (error) {
    console.error("error getValidateReceiptModel:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here +++++++++++++++++++//

const Templated = async () => {
  try {
  } catch (error) {
    console.error("error Templated:", error);
    throw error;
  }
};

//++++++++++++++++++ TEST here +++++++++++++++++++//

export {
  getValidateReceiptModel,
  getReviewQueuePaymentModel,
  getReviewQueueModel,
  postVerifiedDocumentModel,
  activeSemesterServices,
  postVerifiedPaymentModel,
};
