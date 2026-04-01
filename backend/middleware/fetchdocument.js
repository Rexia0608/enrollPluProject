import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads/requirements");

const fetchDocument = async (req, res) => {
  try {
    let { filename } = req.params;

    // Sanitize filename (allow letters, numbers, dash, underscore, optional dot)
    if (!filename.match(/^[a-zA-Z0-9-_\.]+$/)) {
      return res.status(400).json({ message: "Invalid filename" });
    }

    // If filename has no extension, try .jpg first, then .png
    const ext = path.extname(filename);
    if (!ext) {
      const jpgFile = `${filename}.jpg`;
      const pngFile = `${filename}.png`;
      const padfFile = `${filename}.pdf`;

      if (fs.existsSync(path.join(uploadDir, jpgFile))) {
        filename = jpgFile;
      } else if (fs.existsSync(path.join(uploadDir, pngFile))) {
        filename = pngFile;
      } else if (fs.existsSync(path.join(uploadDir, padfFile))) {
        filename = padfFile;
      } else {
        return res.status(404).json({ message: "File not found" });
      }
    }

    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error("Error in fetchDocument:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default fetchDocument;
