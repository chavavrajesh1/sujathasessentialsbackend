const asyncHandler = require("../middleware/asyncHandler");
const Order = require("../models/Order");

/**
 * @desc   Create a new order
 * @route  POST /api/orders
 * @access Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    itemsTotal,
    gst,
    shipping,
    totalAmount,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // ⭐ FIX: Convert frontend format → backend model format
  const formattedItems = orderItems.map((item) => ({
    product: item._id, // must store ObjectID
    name: item.name,
    qty: item.qty,
    price: item.price,
    image: item.images?.[0]?.url || item.image || "",
  }));

  const order = new Order({
    user: req.user._id,
    orderItems: formattedItems,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    itemsTotal,
    gst,
    shipping,
    totalAmount,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

/**
 * @desc   Get order by ID
 * @route  GET /api/orders/:id
 * @access Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

/**
 * @desc   Get logged-in user's orders
 * @route  GET /api/orders/myorders
 * @access Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);
});

/**
 * @desc   Admin - Get all orders
 * @route  GET /api/orders
 * @access Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email");

  res.json(orders);
});

/**
 * @desc   Update payment status
 * @route  PUT /api/orders/:id/pay
 * @access Private
 */
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paymentStatus = "Paid";
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updatePaymentStatus,
};
