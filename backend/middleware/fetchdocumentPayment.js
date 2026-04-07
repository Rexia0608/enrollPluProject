import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/proof-of-payment");

const fetchdocumentPayment = async (req, res) => {
  try {
    let { filename } = req.params;
    // Sanitize
    if (!filename.match(/^[a-zA-Z0-9-_]+$/)) {
      return res.status(400).json({ message: "Invalid filename" });
    }

    // Read all files in upload directory
    const files = fs.readdirSync(uploadDir);

    const matchedFile = files.find((file) => {
      const baseName = path.basename(file, path.extname(file));
      return baseName === filename || baseName.startsWith(filename + "-");
    });

    if (!matchedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadDir, matchedFile);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchdocumentPayment;
