const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/Product");
const Tour = require("../models/Tour");
const Order = require("../models/Order");
const User = require("../models/User");

const getAdminStats = asyncHandler(async (req, res)=> {
    const totalProducts = await Product.countDocuments();
    const totalTours = await Tour.countDocuments();

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
        totalProducts,
        totalTours,
        totalOrders,
        totalUsers,
    });
});

module.exports = { getAdminStats }