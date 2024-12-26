const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
