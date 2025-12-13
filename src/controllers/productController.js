const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/Product");

/* ===========================================================
   CATEGORY → SUBCATEGORY MAP
=========================================================== */
const allowedMap = {
  pickles: ["veg", "nonveg", "andhra", "telangana"],
  temple: ["agarbatti", "puja-items", "sandal"],
  sweets: ["sweet", "hot"],          // ✅ sweets & hot foods
  home: [],
};

/* ===========================================================
   CREATE PRODUCT (ADMIN)
=========================================================== */
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description = "",
    category,
    subCategory = "",
    price = 0,
    countInStock = 0,
  } = req.body;

  // 🔴 Required validation
  if (!name || !slug || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 🔴 Invalid category
  if (!allowedMap[category]) {
    return res.status(400).json({ message: "Invalid category" });
  }

  // 🔴 Invalid sub category
  if (subCategory && !allowedMap[category].includes(subCategory)) {
    return res.status(400).json({
      message: `Invalid subCategory for ${category}. Allowed: ${allowedMap[
        category
      ].join(", ")}`,
    });
  }

  // ✅ Create product
  const product = new Product({
    name,
    slug,
    description,
    category,
    subCategory,
    price,
    countInStock,
  });

  // ✅ Save images (multer)
  if (req.files && req.files.length > 0) {
    product.images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename || file.public_id,
    }));
  }

  await product.save();

  res.status(201).json({
    ...product.toObject(),
    image: product.getImage(),
  });
});

/* ===========================================================
   GET ALL PRODUCTS (PUBLIC)
=========================================================== */
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const { search, category, subCategory, minPrice, maxPrice, sort } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  const count = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const formatted = products.map((p) => ({
    ...p.toObject(),
    image: p.getImage(),
  }));

  res.json({
    products: formatted,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

/* ===========================================================
   GET PRODUCT BY ID (PUBLIC)
=========================================================== */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    ...product.toObject(),
    image: product.getImage(),
  });
});

/* ===========================================================
   UPDATE PRODUCT (ADMIN)
=========================================================== */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const {
    name,
    slug,
    description,
    category,
    subCategory,
    price,
    countInStock,
  } = req.body;

  if (category && !allowedMap[category]) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (category && subCategory && !allowedMap[category].includes(subCategory)) {
    return res.status(400).json({
      message: `Invalid subCategory for ${category}`,
    });
  }

  if (name) product.name = name;
  if (slug) product.slug = slug;
  if (description) product.description = description;
  if (category) product.category = category;
  if (subCategory !== undefined) product.subCategory = subCategory;
  if (price !== undefined) product.price = price;
  if (countInStock !== undefined) product.countInStock = countInStock;

  // Replace images if uploaded
  if (req.files && req.files.length > 0) {
    product.images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename || file.public_id,
    }));
  }

  await product.save();

  res.json({
    ...product.toObject(),
    image: product.getImage(),
  });
});

/* ===========================================================
   DELETE PRODUCT (ADMIN)
=========================================================== */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();

  res.json({ message: "Product removed successfully" });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
