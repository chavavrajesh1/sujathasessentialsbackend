const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ------------------------
// ✅ Public Routes
// ------------------------
router.get("/", getProducts);          // fetch all products
router.get("/:id", getProductById);    // fetch single product

// ------------------------
// ✅ Admin Routes (protected)
// ------------------------
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 6), // accept up to 6 images
  createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 6),
  updateProduct
);

router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
