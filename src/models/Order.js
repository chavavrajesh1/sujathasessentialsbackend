const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        qty: Number,
        price: Number,
        image: String,
      }
    ],

    shippingAddress: {
      fullName: String,
      mobile: String,
      pincode: String,
      state: String,
      district: String,
      address: String,
      landmark: String,
    },

    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "Pending" },

    itemsTotal: Number,
    gst: Number,
    shipping: Number,
    totalAmount: Number,

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;   // ✔ FIXED
