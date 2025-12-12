require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const Tour = require("../models/Tour");
const products = require("./sampleProducts.json");
const tours = require("./sampleTours.json");

const importData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        await Tour.deleteMany();
        await Product.insertMany(products);
        await Tour.insertMany(tours);
        console.log("Data Imported");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

importData();
