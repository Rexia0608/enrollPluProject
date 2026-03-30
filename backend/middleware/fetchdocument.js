import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/requirements");

const fetchDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log(filename);

    // Sanitize filename to prevent path traversal
    if (!filename.match(/^[a-zA-Z0-9-_\.]+$/)) {
      return res.status(400).json({ message: "Invalid filename" });
    }

    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Serve file inline (works for PDF + images)
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error in fetchDocument:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchDocument;
