const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/Product");

/* ✅ Allowed categories */
const allowedMap = {
  pickles: ["veg", "nonveg", "andhra", "telangana"],
  temple: ["agarbatti", "puja-items", "sandal"],
  sweets: ["sweet", "hot"], // ⭐ SWEETS & HOT
  home: [],
};

/* ---------------- CREATE PRODUCT ---------------- */
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description = "",
    category,
    subCategory = "",
    price = 0,
    countInStock = 0,
  } = req.body;

  if (!name || !slug || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!allowedMap[category]) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (subCategory && !allowedMap[category].includes(subCategory)) {
    return res.status(400).json({
      message: `Invalid subCategory for ${category}`,
    });
  }

  const product = new Product({
    name,
    slug,
    description,
    category,
    subCategory,
    price,
    countInStock,
  });

  if (req.files?.length) {
    product.images = req.files.map((f) => ({
      url: f.path,
      public_id: f.filename,
    }));
  }

  await product.save();

  res.status(201).json({
    ...product.toObject(),
    image: product.getImage(),
  });
});

/* ---------------- GET PRODUCTS ---------------- */
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, subCategory } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;

  const products = await Product.find(filter).sort({ createdAt: -1 });

  res.json({
    products: products.map((p) => ({
      ...p.toObject(),
      image: p.getImage(),
    })),
  });
});

/* ---------------- GET PRODUCT BY ID ---------------- */
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    ...product.toObject(),
    image: product.getImage(),
  });
});
