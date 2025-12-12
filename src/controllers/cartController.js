const asyncHandler = require("../middleware/asyncHandler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// get user's cart
const getCart = asyncHandler(async (req, res)=>{
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name price images");
    if(!cart){
        cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
});

// update item (add/increase)
const addToCart = asyncHandler(async (req, res)=>{
    const { productId, qty } = req.body;
    const product = await Product.findById(productId);
    if(!product) { res.status(404); throw new Error("Product not found"); }

    let cart = await Cart.findById({ user: req.user._id });
    if(!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const exist = cart.items.find(i => i.product.toString() === productId);
    if(exist){
        exist.qty = (exist.qty || 1) + (qty || 1);
    }else{
        cart.items.push({ product: productId, qty: qty || 1 });
    }
    await cart.save();
    res.json(cart);
});

// remove from cart
const removeFromCart = asyncHandler(async (req, res)=> {
    const productId = req.params.productId;
    let cart = await Cart.findOne({ user: req.user._id });
    if(!cart) { res.status(404); throw new Error("Cart not found"); }
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    res.json(cart);
});

module.exports = { getCart, addToCart, removeFromCart };