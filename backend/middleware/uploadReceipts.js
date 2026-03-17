import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads/proof-of-payment");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    try {
      // `req.body.user` is a JSON string (if frontend sends it correctly)
      const userStr = req.body.user || "{}";
      const pmtDetailsStr = req.body.paymentDetails || "{}";
      const user = JSON.parse(userStr);
      const pmtDetail = JSON.parse(pmtDetailsStr);

      const fieldName = file.fieldname; // "proofOfPayment"
      const ext = path.extname(file.originalname).toLowerCase();

      const newFilename = `${fieldName}-${user.activeEnrollmentId}-${pmtDetail.period}${ext}`;

      cb(null, newFilename);
    } catch (error) {
      console.error("Error parsing user JSON:", error);
      // Fallback if parsing fails
      cb(
        null,
        `unknown-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
      );
    }
  },
});

const uploadReceipts = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed!"));
    }
  },
});

export default uploadReceipts;
