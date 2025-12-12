const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: { type: String, default: "" },

    category: {
      type: String,
      required: true,
      enum: ["pickles", "temple", "home"],
    },

    subCategory: {
      type: String,
      enum: [
        "veg",
        "nonveg",
        "andhra",
        "telangana",
        "agarbatti",
        "puja-items",
        "sandal",
      ],
      default: "",
    },

    price: { type: Number, required: true, min: 0, default: 0 },

    countInStock: { type: Number, min: 0, default: 0 },

    // ⭐ Images optional (Cloudinary or Uploads)
    images: [
      {
        url: { type: String, required: false },
        public_id: { type: String, required: false },
      },
    ],

    createdAt: { type: Date, default: Date.now },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

/* ===========================================================
   ⭐ Virtual Field: product.image
   Returns correct image automatically:

   - If Cloudinary → return url
   - If upload file → return /uploads/xyz.jpg
   - If no image → return placeholder
=========================================================== */
productSchema.virtual("image").get(function () {
  if (this.images?.length > 0 && this.images[0].url) {
    return this.images[0].url;
  }

  // Fallback placeholder
  return "https://via.placeholder.com/400?text=No+Image";
});

/* ===========================================================
   ⭐ Helper Method (If needed in controllers)
=========================================================== */
productSchema.methods.getImage = function () {
  if (this.images?.length > 0 && this.images[0].url) {
    return this.images[0].url;
  }
  return "https://via.placeholder.com/400?text=No+Image";
};

module.exports = mongoose.model("Product", productSchema);
