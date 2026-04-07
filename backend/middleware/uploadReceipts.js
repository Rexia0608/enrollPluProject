import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurable upload directory
const uploadDir = process.env.UPLOAD_DIR
  ? path.join(__dirname, process.env.UPLOAD_DIR)
  : path.join(__dirname, "../uploads/proof-of-payment");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
}

// Allowed file types
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

// Simple sanitization function to replace unsafe characters
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-z0-9.-]/gi, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    try {
      const userStr = req.body.user || "{}";
      const pmtDetailsStr = req.body.paymentDetails || "{}";
      const user = JSON.parse(userStr);
      const pmtDetail = JSON.parse(pmtDetailsStr);

      const enrollmentId = sanitizeFilename(
        String(user.activeEnrollmentId || "unknown"),
      );
      const period = sanitizeFilename(String(pmtDetail.period || "unknown"));
      const ext = path.extname(file.originalname).toLowerCase();

      const newFilename = `${enrollmentId}-${period}${ext}`;

      cb(null, newFilename);
    } catch (error) {
      console.error("Error generating filename:", error);
      const fallbackName = `unknown-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, sanitizeFilename(fallbackName));
    }
  },
});

const uploadReceipts = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

    if (isValidExt && isValidMime) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
        ),
      );
    }
  },
});

export default uploadReceipts;
