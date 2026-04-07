import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/proof-of-payment");

const deleteVerifiedPayment = async (req, res, next) => {
  try {
    const { peymentId, action } = req.body;

    // Basic validation
    if (!peymentId) {
      return res.status(400).json({ message: "peymentId is required" });
    }

    if (!peymentId.match(/^[a-zA-Z0-9-_\.]+$/)) {
      return res.status(400).json({ message: "Invalid peymentId" });
    }

    // If status is not false, just continue
    if (action !== false) {
      return next();
    }

    // --- status === false: delete all files starting with peymentId- ---
    const prefix = `${peymentId}-`;
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

    console.log(`Deleted ${deletedCount} file(s) for student ${peymentId}`);

    // Attach info to request if needed
    req.fileDeleted = true;
    req.deletedCount = deletedCount;

    next();
  } catch (error) {
    console.error("Error in deleteVerifiedPayment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteVerifiedPayment;
