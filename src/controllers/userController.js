const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

// Get Current Profile
const getProfile = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user._id).select("-password");
    if(user){
        res.json(user);
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});

// Update Profile
const updateProfile = asyncHandler(async (req,res)=> {
    const user = await User.findById(req.user._id);
    if(!user){
        res.status(404);
        throw new Error("User not found");
    }
    const { name, email, password } = req.body;
    if(name) user.name = name;
    if(email) user.email = email;
    if(password) user.password = password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isAdmin = !user.isAdmin; // toggle admin on/off
  await user.save();

  res.json({ message: "User role updated", user });
});

module.exports = { getProfile, updateProfile, getUsers, updateUserRole };