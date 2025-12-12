const crypto = require("crypto");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/sendEmail");

// ⭐ FORGOT PASSWORD — Send Reset Email
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No user found with this email");
  }

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  // Reset URL
  const resetUrl = `https://sujathasessentials.com/reset-password/${token}`;

  const message = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password. This link is valid for 10 minutes.</p>

    <a href="${resetUrl}" 
       style="background:#6366f1;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;">
       Reset Password
    </a>

    <p>If you didn’t request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: message,
  });

  res.json({ message: "Password reset email sent" });
});

// ⭐ RESET PASSWORD — Update New Password
exports.resetPassword = asyncHandler(async (req, res) => {
  const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: Date.now() }, // Not expired
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
});

// ⭐ FORGOT USER ID — Send email with registered account email
exports.forgotUserId = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  await sendEmail({
    to: email,
    subject: "Your User ID",
    html: `
      <h2>Your User ID</h2>
      <p>Your login email is:</p>
      <h3>${user.email}</h3>
    `,
  });

  res.json({ message: "User ID sent to your email" });
});
