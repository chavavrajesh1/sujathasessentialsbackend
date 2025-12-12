const express = require("express");
const router = express.Router();
const { createOrder, getOrderById, getMyOrders, getAllOrders, updatePaymentStatus } = require("../controllers/orderController");   
const { protect, admin } = require("../middleware/authMiddleware");

// User Routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id",protect, getOrderById);


// Admin Routes
router.get("/", protect, admin, getAllOrders);
router.post("/:id/pay", protect, updatePaymentStatus);

module.exports =  router;