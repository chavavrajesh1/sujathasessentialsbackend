const express = require("express");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.get("/send-test-email", async (req, res) => {
  try {
    await sendEmail({
      email: "info@sujathasessentials.com",
      subject: "Test Email - Sujatha'S Essentials",
      message: `
                <h2>Email Test Successful 🎉</h2>
                <p>This is a test message from your Sujatha's Essentials backend.</p>
                <p>If you're reading this, SMTP is working perfectly!</p>
                `
    });

    res.json({ success: true, message: "Test email sent successfully."});
  } catch (error) {
    console.error("Email Test Error:", error);
    res.status(500).json({
        success: false,
        message: "Email test failed",
        error: error.message
    });
  }
});

module.exports = router