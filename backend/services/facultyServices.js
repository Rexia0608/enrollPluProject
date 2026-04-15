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
    let query;
    let values;

    if (passData.action) {
      const qr_svg = qr.image(`${passData.reference}`);

      query = `
        WITH updated_transaction AS (
            UPDATE transaction_table t
            SET
                updated_at = NOW(),
                payment_status = 'paid'
            WHERE 
                t.enrollment_id = $1
                AND t.period = $2
            RETURNING 
                t.enrollment_id,
                t.id,
                t.remarks,
                t.paid_amount,
                t.updated_at
        ),
        updated_enrollment AS (
            UPDATE enrollment_profile e
            SET
                enrollment_status = 'enrolled',
                updated_at = NOW()
            WHERE 
                e.enrollment_id = $1
            RETURNING 
                e.enrollment_id,
                e.user_id,
                e.course_code_id,
                e.year_level
        )
        SELECT 
            c.email,
            u.first_name,
            u.last_name,
            ut.id AS transaction_id,
            e.year_level,
            co.course_code,
            ut.paid_amount,
            ut.updated_at
        FROM updated_transaction ut
        JOIN updated_enrollment e 
            ON ut.enrollment_id = e.enrollment_id
        JOIN users u 
            ON e.user_id = u.id
        JOIN credentials c 
            ON u.id = c.user_id
        JOIN courses co 
            ON e.course_code_id = co.id;
      `;

      values = [passData.enrollmentId, passData.period];

      qr_svg.pipe(fs.createWriteStream(`uploads/qr/${passData.reference}.png`));
    }

    if (!passData.action) {
      query = `
        WITH updated AS (
            UPDATE transaction_table t
            SET
                remarks = $1,
                paid_amount = 0.00,
                updated_at = NOW(),
                payment_per_period = $2,
                payment_status = 'pending'
            WHERE
                t.enrollment_id = $3
                AND t.period = $4
            RETURNING t.enrollment_id
        )
        SELECT 
            c.email
        FROM updated u
        JOIN enrollment_profile e 
            ON u.enrollment_id = e.enrollment_id
        JOIN users usr 
            ON e.user_id = usr.id
        JOIN credentials c 
            ON usr.id = c.user_id;
      `;

      values = [
        passData.remarks,
        parseFloat(passData.paidAmount.replace(/,/g, "")),
        passData.enrollmentId,
        passData.period,
      ];
    }

    return { query, values };
  } catch (error) {
    console.error("error postVerifiedPaymentServices:", error);
    throw error;
  }
};

const confirmedServices = async (data, passData) => {
  try {
    if (passData.action) {
      const qrFilePath = path.join(
        process.cwd(),
        "uploads",
        "qr",
        `${data.transaction_id}.png`,
      );

      const attachments = [
        {
          filename: `QR_${data.transaction_id}.png`,
          path: qrFilePath,
          cid: "qr_cid",
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
            <p><strong>Enrolled Course:</strong> ${escapeHtml(data.course_code)}</p> 
            <p><strong>Year Level:</strong> ${escapeHtml(data.year_level)}</p>
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

      await sendEmail(
        "payment-confirmed",
        data.email,
        receiptContent,
        attachments,
      );
      await fs.promises.unlink(qrFilePath).catch(() => {});
    }

    if (!passData.action) {
      await sendEmail("payment-rejected", data.email, passData.remark);
    }
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

const postPromissoryFileServices = async (passData) => {
  try {
    let query;
    let value;
    if (passData.action) {
      query = `
        WITH updated AS (
            UPDATE transaction_table t
            SET
                remarks = $1,
                updated_at = NOW(),
                payment_status = 'pending'
            WHERE
                t.enrollment_id = $2
                AND t.period = $3
            RETURNING t.enrollment_id
        )
        SELECT 
            c.email
        FROM updated u
        JOIN enrollment_profile e 
            ON u.enrollment_id = e.enrollment_id
        JOIN users usr 
            ON e.user_id = usr.id
        JOIN credentials c 
            ON usr.id = c.user_id;
      `;

      value = [passData, passData.enrollmentId, passData.period];

      return { query, value };
    } else {
      query = `
        WITH updated AS (
            UPDATE transaction_table t
            SET
                remarks = $1,
                updated_at = NOW(),
                payment_status = 'pending'
            WHERE
                t.enrollment_id = $2
                AND t.period = $3
            RETURNING t.enrollment_id
        )
        SELECT 
            c.email
        FROM updated u
        JOIN enrollment_profile e 
            ON u.enrollment_id = e.enrollment_id
        JOIN users usr 
            ON e.user_id = usr.id
        JOIN credentials c 
            ON usr.id = c.user_id;
      `;
      value = [passData, passData.enrollmentId, passData.period];
    }
    return { query, value };
  } catch (error) {
    console.error("error postPromissoryFileServices:", error);
    throw error;
  }
};

const confirmPromisorryFileServices = async (email, passData) => {
  try {
    if (passData.action) {
      await sendEmail("promised-note-accepted", email, passData.remark);
    } else {
      await sendEmail("promised-note-rejected", email, passData.remark);
    }
  } catch (error) {
    console.error("error confirmPromisorryFileServices:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ TEST here  +++++++++++++++++++//

const promissoryAutomationServices = async () => {
  try {
    return query;
  } catch (error) {
    console.error("error promissoryAutomationServices:", error);
    throw error;
  }
};

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
  promissoryAutomationServices,
  confirmPromisorryFileServices,
  postPromissoryFileServices,
  getValidateReceiptServices,
  postVerifiedPaymentServices,
  getReviewQueuePaymentServices,
  fetchReviewQueueServices,
  documentReviewServices,
  activeSemesterServices,
};
