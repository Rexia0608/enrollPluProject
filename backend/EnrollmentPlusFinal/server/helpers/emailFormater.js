import config from "../config/auth.js";

const emailFormater = (data) => ({
  to: data.email,
  from: config.email.user,
  subject: "⚠️ Account Warning: Maximum Login Attempts Reached",
  text: `Warning ${data.first_name}, someone tried to access your account. Your account has reached the maximum login attempts and is temporarily locked.`,
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #dc2626;">⚠️ Account Alert</h2>
      <p>Hello ${data.first_name},</p>
      <p>Your account has reached the maximum login attempts and is temporarily locked.</p>
      <a href="https://your-website.com/password-reset"
         style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </div>
  `,
});

export default emailFormater;
