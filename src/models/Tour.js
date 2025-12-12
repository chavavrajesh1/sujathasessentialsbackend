const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    places: String,
    duration: String,
    price: Number,
    images: [{ url: String, public_id: String }],
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tour", tourSchema);