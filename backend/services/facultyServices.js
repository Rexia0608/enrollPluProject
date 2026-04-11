import { sendEmail } from "../utils/mailer.js";
import qr from "qr-image";
import fs from "fs";
import path from "path";

const fetchReviewQueueServices = (passData) => {
  try {
    const value = [passData];
    const query = `SELECT 
            ep.enrollment_id,
            ep.enrollment_status,
            ep.student_type,
            ep.year_level,
            u.id AS user_id,
            u.first_name,
            u.last_name,
            c.course_code,
            c.course_name,
            cr.email,
            ay.year_series,
            ay.semester
        FROM enrollment_profile ep
        JOIN users u 
            ON ep.user_id = u.id
        JOIN credentials cr 
            ON cr.user_id = u.id  
        JOIN courses c 
            ON ep.course_code_id = c.id
        JOIN academic_year ay 
            ON ep.enrollment_year_code = ay.id
        WHERE ep.enrollment_year_code = $1
        AND ep.enrollment_status = 'documents_review';
        `;

    return { query, value };
  } catch (error) {
    console.error("fetchReviewQueue error:", error);
    throw error;
  }
};

const documentReviewServices = (data) => {
  try {
    let queries = [];
    let values = [];

    if (data.status) {
      queries.push(`
        UPDATE enrollment_profile
        SET enrollment_status = 'payment_pending' 
        WHERE enrollment_id = $1 
        AND user_id = $2
        RETURNING *;
      `);

      values.push([data.fileId, data.studentId]);
    } else {
      queries.push(`
        DELETE FROM transaction_table
        WHERE enrollment_id = $1
        RETURNING *;
      `);

      queries.push(`
        DELETE FROM enrollment_profile
        WHERE enrollment_id = $1
        RETURNING *;
      `);

      values.push([data.fileId]);
      values.push([data.fileId]);
    }

    return { queries, values };
  } catch (error) {
    console.error("Document Review Services error:", error);
    throw error;
  }
};

const activeSemesterServices = async () => {
  try {
    let querySemester = `SELECT id FROM academic_year WHERE enrollment_open = 'true' LIMIT 1;`;
    return { querySemester };
  } catch (error) {
    console.error("error activeSemesterServices:", error);
    throw error;
  }
};

const getReviewQueuePaymentServices = async () => {
  try {
    let query = `
    SELECT * 
    FROM transaction_table 
    WHERE payment_status = 'review';
    `;
    return { query };
  } catch (error) {
    console.error("error getReviewQueuePaymentServices:", error);
    throw error;
  }
};

const postVerifiedPaymentServices = async (passData) => {
  try {
    let queries = [];
    let values = [];

    if (passData.action) {
      var qr_svg = qr.image(`${passData.reference}`);
      queries.push(`UPDATE transaction_table
                SET
                    remarks = $1,
                    updated_at = NOW(), 
                    payment_status = 'paid'
                WHERE 
                    enrollment_id = $2
                    AND period = $3;
                `);

      qr_svg.pipe(fs.createWriteStream(`uploads/qr/${passData.reference}.png`));

      values.push([
        JSON.stringify(`${passData.reference}`),
        passData.enrollmentId,
        passData.period,
      ]);

      queries.push(`
        SELECT 
            c.email,
            u.first_name,
            u.last_name,
            t.id,
            t.remarks,
            t.paid_amount, 
            t.updated_at
        FROM transaction_table t
        JOIN enrollment_profile e 
            ON t.enrollment_id = e.enrollment_id
        JOIN users u
            ON e.user_id = u.id
        JOIN credentials c 
            ON u.id = c.user_id
        WHERE t.enrollment_id = $1
          AND t.period = $2
          AND t.payment_status = 'paid';
        `);

      values.push([passData.enrollmentId, passData.period]);
    }

    if (passData.action && passData.period == "enrollment") {
      queries.push(`UPDATE enrollment_profile
                SET
                    enrollment_status = 'enrolled',
                    updated_at = NOW()
                WHERE 
                    enrollment_id = $1;
                `);
      values.push([passData.enrollmentId]);
    }

    if (!passData.action) {
      queries.push(`UPDATE transaction_table
                SET
                    remarks = $1,
                    paid_amount = 0.00,
                    updated_at = NOW(),
                    payment_per_period = $2,
                    payment_status = 'pending'
                WHERE 
                    enrollment_id = $3
                    AND period = $4;
                `);
      values.push([
        JSON.stringify(passData.remark),
        parseFloat(passData.paidAmount.replace(/,/g, "")).toFixed(2),
        passData.enrollmentId,
        passData.period,
      ]);
    }

    return { queries, values };
  } catch (error) {
    console.error("error postVerifiedPaymentServices:", error);
    throw error;
  }
};

const confirmedServices = async (data, passData) => {
  try {
    const qrFilePath = path.join(
      process.cwd(),
      "uploads",
      "qr",
      `${data.remarks}.png`,
    );

    // Prepare attachment with a unique Content-ID
    const attachments = [
      {
        filename: `QR_${data.remarks}.png`,
        path: qrFilePath,
        cid: "qr_cid", // this matches the img src
      },
    ];

    const formattedAmount = parseFloat(data.paid_amount).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "PHP",
      },
    );

    const receiptContent = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align: top; padding-right: 20px;">
          <p><strong>Student:</strong> ${escapeHtml(data.first_name)} ${escapeHtml(data.last_name)}</p>
          <p><strong>Period:</strong> ${escapeHtml(passData.period)}</p>
          <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
          <p><strong>Payment Date:</strong> ${new Date(data.updated_at).toLocaleString()}</p>
          <p><strong>Reference:</strong> ${escapeHtml(passData.reference || "N/A")}</p>
        </td> 

        <td style="vertical-align: top; text-align: center;">
          <img src="cid:qr_cid" alt="Payment QR Code"
            style="max-width: 150px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px;" />
          <p style="font-size: 12px; color: #6b7280;">Scan to verify payment</p>
        </td>
      </tr>
    </table>
      `;

    // Pass attachments as 4th argument
    await sendEmail(
      "payment-confirmed",
      data.email,
      receiptContent,
      attachments,
    );
    await fs.promises.unlink(qrFilePath).catch(() => {});
  } catch (error) {
    console.error("error confirmedServices:", error);
    throw error;
  }
};

const getValidateReceiptServices = async (passData) => {
  try {
    let query;
    let value;

    query = `
    SELECT 
      u.first_name,
      u.last_name,
      t.paid_amount,
      t.payment_type,
      t.period,
      t.updated_at,
      c.course_name,
      ay.semester,
      ay.year_series
    FROM transaction_table t
    JOIN enrollment_profile e 
        ON t.enrollment_id = e.enrollment_id
    JOIN users u 
        ON e.user_id = u.id
    JOIN courses c 
        ON e.course_code_id = c.id
    JOIN academic_year ay
        ON e.enrollment_year_code = ay.id
    WHERE t.id = $1;
    `;

    value = [passData];
    return { query, value };
  } catch (error) {
    console.error("error getValidateReceiptServices:", error);
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

//++++++++++++++++++ HELPER +++++++++++++++++++//
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}
//++++++++++++++++++ HELPER +++++++++++++++++++//

export {
  confirmedServices,
  getValidateReceiptServices,
  postVerifiedPaymentServices,
  getReviewQueuePaymentServices,
  fetchReviewQueueServices,
  documentReviewServices,
  activeSemesterServices,
};
