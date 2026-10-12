const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // STARTTLS
  auth: {
    user: (process.env.SMTP_USER || "").trim(),
    pass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""),
  },
});

/**
 * Send password reset OTP email
 * @param {string} toEmail 
 * @param {string} otpCode 
 */
const sendPasswordResetOtpEmail = async (toEmail, otpCode) => {
  const mailOptions = {
    from: `"Branded LinkHub Support" <${process.env.SMTP_USER || "bhaveshganwani37@gmail.com"}>`,
    to: toEmail,
    subject: "Branded LinkHub - Password Reset Verification Code",
    html: `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 800;">Branded LinkHub</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Password Reset Verification Code</p>
        </div>
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">Hello,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">You requested to reset your password. Use the following 6-digit OTP verification code to complete your password reset request:</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #2563eb; background-color: #eff6ff; padding: 12px 28px; border-radius: 12px; border: 1px solid #bfdbfe;">
            ${otpCode}
          </span>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center;">This code will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">© ${new Date().getFullYear()} Branded linkHub. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetOtpEmail,
};
