require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const placeholder = "https://via.placeholder.com/400?text=No+Image";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 Connected to MongoDB");
    fixProducts();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

async function fixProducts() {
  try {
    const products = await Product.find({});
    console.log(`🔍 Found ${products.length} products`);

    for (let product of products) {
      let updated = false;

      // 1️⃣ Fix images array issues
      if (!product.images || product.images.length === 0) {
        product.images = [
          { url: placeholder, public_id: "placeholder" }
        ];
        updated = true;
        console.log(`🟡 Added placeholder image → ${product.name}`);
      }

      // If Cloudinary image exists but broken
      if (product.images[0] && !product.images[0].url) {
        product.images[0].url = placeholder;
        product.images[0].public_id = "placeholder";
        updated = true;
        console.log(`🟠 Repaired missing url in image → ${product.name}`);
      }

      // 2️⃣ Force image virtual field to be correct
      const newImage = product.getImage();
      if (!newImage || newImage.includes("undefined")) {
        product.images = [
          { url: placeholder, public_id: "placeholder" }
        ];
        updated = true;
        console.log(`🔴 Fixed invalid image → ${product.name}`);
      }

      // Save only if updated
      if (updated) {
        await product.save();
        console.log(`✅ Updated: ${product._id} (${product.name})`);
      }
    }

    console.log("\n🎉 FIX COMPLETED. All products updated successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error fixing products:", err);
    process.exit(1);
  }
}
