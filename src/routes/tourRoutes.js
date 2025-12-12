const express = require("express");
const router = express.Router();
const { createTour, getTours, getTourById, updateTour, deleteTour } = require("../controllers/tourController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getTours);
router.post("/", protect, admin, upload.array("images", 6), createTour);
router.get("/:id", getTourById);
router.put("/:id", protect, admin, upload.array("images", 6), updateTour);
router.delete("/:id", protect, admin, deleteTour);

module.exports = router;