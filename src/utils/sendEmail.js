const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Send email using Gmail SMTP
 * Accepts:
 * - email (preferred)
 * - to (fallback)
 * - subject
 * - message (HTML)
 * - html (optional)
 * - text (optional)
 */
const sendEmail = async ({ email, to, subject, message, html, text }) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email || to,        // Support both
        subject,
        html: html || message,  // Support both
        text
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};

module.exports = sendEmail;
