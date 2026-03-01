import db from "../config/db.js";
import fs from "fs";
import path from "path";

const documentsHandlerModel = async (files, enrollmentId) => {
  try {
    const fileRecords = [];

    for (const [docType, fileArray] of Object.entries(files)) {
      const file = fileArray[0]; // Assuming one file per field

      // Insert file metadata into the DB
      const result = await db.query(
        `INSERT INTO documents (enrollment_id, doc_type, file_name, file_path, uploaded_at) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [enrollmentId, docType, file.filename, file.path],
      );

      fileRecords.push(result.rows[0]);
    }

    return fileRecords; // Return the inserted records if needed
  } catch (error) {
    console.error("Error in documentsHandlerModel:", error);
    throw error;
  }
};

export { documentsHandlerModel };
