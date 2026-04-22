import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/images");

const photofinder = async (req, res) => {
  try {
    let { file } = req.params;

    // Allow letters, numbers, dash, underscore, and dot
    if (!/^[a-zA-Z0-9-_.]+$/.test(file)) {
      return res.status(400).json({ message: "Invalid file name" });
    }

    // Extract basename without extension from request
    const requestedBase = path.basename(file, path.extname(file));

    const files = fs.readdirSync(uploadDir);
    const matchedFile = files.find((f) => {
      const baseName = path.basename(f, path.extname(f));
      return (
        baseName === requestedBase || baseName.startsWith(requestedBase + "-")
      );
    });

    if (!matchedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadDir, matchedFile);
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default photofinder;
