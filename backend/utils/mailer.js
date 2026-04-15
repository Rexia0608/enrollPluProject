import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create transporter once (performance optimization)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

/**
 * Send emails based on type
 * @param {string} type - Email type: 'sending_OTP', 'burst_email', 'verified_email'
 * @param {string|string[]} to - Single email or array of emails
 * @param {string} message - Content to include in email
 * @returns {Promise<Object>} Results of email sending attempts
 */
export const sendEmail = async (type, to, message, attachments = []) => {
  console.log(
    `[Email Service] Type: ${type}, Recipients: ${Array.isArray(to) ? to.length : 1}, Message: ${message?.substring(0, 50)}...`,
  );

  // Normalize recipients to array
  const recipients = Array.isArray(to) ? to : [to];

  if (recipients.length === 0) {
    throw new Error("No recipients provided");
  }

  // Get email configuration based on type
  const emailConfig = getEmailConfig(type, message);
  if (!emailConfig) {
    throw new Error(`Unknown email type: ${type}`);
  }

  const { subject, html } = emailConfig;

  // Send to all recipients with individual error handling
  const results = await Promise.allSettled(
    recipients.map(async (email) => {
      try {
        const info = await transporter.sendMail({
          from: `"EnrollPlus" <${process.env.EMAIL_USER}>`,
          to: email,
          subject,
          html,
          attachments,
        });
        return { email, messageId: info.messageId, status: "sent" };
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error.message);
        return { email, status: "failed", error: error.message };
      }
    }),
  );

  // Format results
  const summary = {
    total: recipients.length,
    successful: results.filter((r) => r.value?.status === "sent").length,
    failed: results.filter((r) => r.value?.status === "failed").length,
    details: results.map((r) => r.value || r.reason),
  };

  console.log(
    `[Email Service] Completed: ${summary.successful}/${summary.total} sent`,
  );

  return summary;
};

/**
 * Get email configuration based on type
 */
const getEmailConfig = (type, message) => {
  switch (type) {
    case "sending_OTP":
      return {
        subject: "Your EnrollPlus Verification Code.",
        html: sendOtp(message),
      };

    case "burst_email":
      return {
        subject: "📢 New Announcement from EnrollPlus",
        html: announcement(message),
      };

    case "verified_email":
      return {
        subject: "Your Account Has Been Verified.",
        html: verifiedMsg(message),
      };

    case "evaluation_email":
      return {
        subject: "Your Enrollment Application is Under Evaluation.",
        html: evaluationMsg("email"),
      };

    case "payment-validation":
      return {
        subject: "Payment validation update.",
        html: paymentValidation(message),
      };

    case "promised-note-validation":
      return {
        subject: "Promised note validation update.",
        html: promisedNote(message),
      };

    case "promised-note-accepted":
      return {
        subject: "Temporary permit.",
        html: promisedNoteAccepted(message),
      };

    case "promised-note-rejected":
      return {
        subject: "Promissory request update.",
        html: promisedNoteRejected(message),
      };

    case "payment-confirmed":
      return {
        subject: "Payment Receipt",
        html: paymentConfirmed(message),
      };

    case "payment-rejected":
      return {
        subject: "Payment Evaluation update.",
        html: paymentRejected(message),
      };

    case "password-reset":
      return {
        subject: "🔑 Password Reset.",
        html: passwordReset(message),
      };

    case "password-set":
      return {
        subject: "🔑 Password Reset success.",
        html: passwordSet(message),
      };

    default:
      return null;
  }
};

/**
 * Template: Account Verified
 */
const verifiedMsg = (email) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; line-height: 1.6;">
      <h2 style="color: #2563eb; margin-top: 0;">Welcome to EnrollPlus 🎓</h2>

      <p>Hi there,</p>

      <p>
        Great news! Your email address <b>${email}</b> has been <b>successfully verified</b>.
        Your account is now fully activated and ready to use.
      </p>

      <p>
        You can now log in, complete your enrollment, and stay updated with
        important announcements and notifications.
      </p>

      <div style="margin: 24px 0; text-align: center;">
        <a
          href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login"
          style="
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
          "
        >
          Go to Login
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

      <p style="font-size: 12px; color: #6b7280;">
        If you did not create this account, please contact our support team immediately.
      </p>

      <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">
        © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
      </p>
    </div>
  </body>
  </html>
  `;
};

/**
 * Template: Evaluation Stage
 */
const evaluationMsg = () => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; line-height: 1.6;">
    
    <div style="border-left: 4px solid #f59e0b; padding-left: 16px; margin-bottom: 24px;">
      <h2 style="color: #f59e0b; margin: 0; font-size: 24px;">📋 Enrollment Application Under Evaluation</h2>
      <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
    </div>

    <p>Dear Student,</p>

    <p>
      Thank you for submitting your enrollment application to <strong>EnrollPlus</strong>.
    </p>

    <p>
      Your application is now <strong>under evaluation</strong> by our faculty team. 
      We will review your documents and notify you once a decision has been made kindly check your dashboard for the updates.
    </p>

    <div style="margin: 24px 0; text-align: center;">
      <a
        href="http://localhost:5173/student/dashboard"
        style="
          background-color: #f59e0b;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          display: inline-block;
        "
      >
        Check Application Status
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

    <p style="font-size: 12px; color: #6b7280;">
      If you have any questions, please contact our admissions office at support@enrollplus.com.
    </p>

    <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">
      © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
    </p>
  </div>
</body>
</html>
  `;
};

/**
 * Template: OTP Verification
 */
const sendOtp = (otpCode) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; line-height: 1.6;">
        <h2 style="color: #2563eb; margin-top: 0;">Verify Your Email Address 🔐</h2>

        <p>Hi,</p>

        <p>
          To complete your registration with <b>EnrollPlus</b>,
          please use the verification code below:
        </p>

        <div style="margin: 32px 0; text-align: center; background-color: #f3f4f6; padding: 24px; border-radius: 8px;">
          <span
            style="
              font-size: 36px;
              letter-spacing: 12px;
              font-weight: bold;
              color: #111827;
              font-family: 'Courier New', monospace;
            "
          >
            ${otpCode}
          </span>
        </div>

        <p style="text-align: center; color: #dc2626; font-weight: 600;">
          ⏰ This code will expire in 10 minutes
        </p>

        <p style="font-size: 14px; color: #6b7280; text-align: center;">
          Please do not share this code with anyone.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 12px; color: #6b7280;">
          If you did not request this verification, you can safely ignore this email.
        </p>

        <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">
          © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template: Announcement/Broadcast
 */
const announcement = (message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">School Announcement</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
              </div>

              <p style="font-size: 16px; color: #374151; line-height: 1.8;">
                ${message.replace(/\n/g, "<br>")}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Template: Promised note validation
 */
const promisedNote = (message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Faculty Updates.</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
              </div>

              <p style="font-size: 16px; color: #374151; line-height: 1.8;">
                ${message.replace(/\n/g, "<br>")}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Template: Promised note accepted
 */
const promisedNoteAccepted = (message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Promissory note updates.</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
              </div>

              <p style="font-size: 16px; color: #374151; line-height: 1.8;">
                ${message.replace(/\n/g, "<br>")}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Template: Promised note rejected
 */
const promisedNoteRejected = (message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Promissory note updates.</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
              </div>

              <p style="font-size: 16px; color: #374151; line-height: 1.8;">
                ${message.replace(/\n/g, "<br>")}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Template: Password Reset send
 */
const passwordReset = (message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Password Reset</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
              </div>

<p style="font-size: 16px; color: #374151; line-height: 1.8;">
  You can now reset your password using this <a href="${message}">link</a>. Please note that it will only be active for 10 minutes. If the link expires, you will need to request a new one from the administrator.
</p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Template: Password Reset success
 */
const passwordSet = (email) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Password Reset Successful</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
              </div>

<p style="font-size: 16px; color: #374151; line-height: 1.8;">
  Your password for <strong>${email}</strong> has been successfully reset. You can now log in to your EnrollPlus account using your new password.
</p>

<p style="font-size: 14px; color: #4b5563; margin-top: 16px;">
  If you did not request this change, please contact our support team immediately.
</p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Template: Payment note validation
 */
const paymentValidation = (message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">School Announcement</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
              </div>

              <p style="font-size: 16px; color: #374151; line-height: 1.8;">
                ${message.replace(/\n/g, "<br>")}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Template: Payment confirmed
 */
const paymentConfirmed = (message) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
          
          <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
            <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Payment Receipt & Permit</h2>
            <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">From EnrollPlus Administration</p>
          </div>

          ${message}

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
              📧 This is an automated message — please don't reply to this email.
            </p>
          </div>

          <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
            © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
          </p>
          
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Template: Payment Rejected
 */
const paymentRejected = (message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; line-height: 1.6; color: #1f2937; text-align: left;">
              
              <div style="border-left: 4px solid #2563eb; padding-left: 16px; margin-bottom: 24px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Payment Evaluation Update.</h2>
                <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">Please resubmit and review the reason for rejection below.</p>
              </div>

              <p style="font-size: 16px; color: #374151; line-height: 1.8;">
                ${message.replace(/\n/g, "<br>")}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic; margin: 0;">
                  📧 This is an automated message — please don't reply to this email.
                </p>
              </div>

              <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
                © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
              </p>
              
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
