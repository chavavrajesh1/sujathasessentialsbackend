const express = require("express");
const router = express.Router();

const {
    forgotPassword,
    resetPassword,
    forgotUserId,
} = require("../controllers/passwordController");

// Forgot password - send reset email
router.post("/forgot-password", forgotPassword);

// Reset password (after clicking email link)
router.post("/reset-password/:token", resetPassword);

// Forgot User ID (send email with user email)
router.post("/forgot-userid", forgotUserId);

module.exports = router;