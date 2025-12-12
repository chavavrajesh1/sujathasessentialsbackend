const asyncHandler = require("../middleware/asyncHandler");
const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

const submitContact = asyncHandler(async (req, res)=>{
    const {name,email,phone,message} = req.body;
    const contact = await Contact.create({ name, email, phone, message });

    // Optionally send Email to admin
    try {
        await sendEmail({
            to: process.env.FROM_EMAIL,
            subject: `New contact from ${name}`,
            text: `${message}\n\nPhone: ${phone}\nEmail: ${email}`
        });
    }catch(err){
        console.warn("Contact email failed", err.message);
    }

    res.status(201).json(contact);
});

module.exports = {submitContact};