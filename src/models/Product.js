const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    /* ===============================
       CATEGORY
    =============================== */
    category: {
      type: String,
      required: true,
      enum: [
        "pickles",
        "temple",
        "home",
        "sweets", // ✅ ADDED
        "podulu"
      ],
    },

    /* ===============================
       SUB CATEGORY
    =============================== */
    subCategory: {
      type: String,
      enum: [
        // Pickles
        "veg",
        "nonveg",
        "andhra",
        "telangana",

        // Temple
        "agarbatti",
        "puja-items",
        "sandal",

        // Sweets & Hot Foods
        "sweet", // ✅ ADDED
        "hot",   // ✅ ADDED

        // Podulu
        "powder",
        "chutney-powder"

      ],
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    countInStock: {
      type: Number,
      min: 0,
      default: 0,
    },

    /* ===============================
       IMAGES (OPTIONAL)
    =============================== */
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

/* ===========================================================
   ⭐ Virtual Field: product.image
   Always returns a usable image
=========================================================== */
productSchema.virtual("image").get(function () {
  if (this.images?.length > 0 && this.images[0].url) {
    return this.images[0].url;
  }

  return "https://via.placeholder.com/400?text=No+Image";
});

/* ===========================================================
   ⭐ Helper Method (optional)
=========================================================== */
productSchema.methods.getImage = function () {
  if (this.images?.length > 0 && this.images[0].url) {
    return this.images[0].url;
  }
  return "https://via.placeholder.com/400?text=No+Image";
};

module.exports = mongoose.model("Product", productSchema);
