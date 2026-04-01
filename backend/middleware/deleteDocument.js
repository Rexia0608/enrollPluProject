import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/requirements");

const deleteDocument = async (req, res, next) => {
  try {
    const { studentId, status } = req.body;

    // Basic validation
    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    if (!studentId.match(/^[a-zA-Z0-9-_\.]+$/)) {
      return res.status(400).json({ message: "Invalid studentId" });
    }

    // If status is not false, just continue
    if (status !== false) {
      return next();
    }

    // --- status === false: delete all files starting with studentId- ---
    const prefix = `${studentId}-`;
    let deletedCount = 0;

    try {
      const files = await fsPromises.readdir(uploadDir);
      const toDelete = files.filter((file) => file.startsWith(prefix));

      for (const file of toDelete) {
        const filePath = path.join(uploadDir, file);
        await fsPromises.unlink(filePath);
        deletedCount++;
      }
    } catch (err) {
      console.error("Error reading/deleting files:", err);
      // Optionally continue even if deletion partially fails
    }

    console.log(`Deleted ${deletedCount} file(s) for student ${studentId}`);

    // Attach info to request if needed
    req.fileDeleted = true;
    req.deletedCount = deletedCount;

    next();
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteDocument;
