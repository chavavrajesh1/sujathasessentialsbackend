const express = require("express");
const router = express.Router();
const { getProfile,updateProfile, getUsers, updateUserRole } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");


router.get("/profile", protect, getProfile );
router.put("/profile", protect, updateProfile );
router.get("/", protect, admin, getUsers);
router.put("/:id/admin", protect, admin, updateUserRole);


module.exports = router;