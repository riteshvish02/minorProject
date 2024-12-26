const mongoose = require('mongoose');

const ManuscriptSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manuscriptNumber:{
        type: String,
        required: true,
        unique: true,
    },
    mobile:{
        type: Number,
    },
    designation: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    articletype: {
        type: String, // Store description as HTML
        required: true
    },
    country: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
             'Please fill a valid email address'
            ]
    },
    status:{
        type: String,
        enum: ['Pending', 'Rejected', 'Accepted', 'Under Review'],
        default: 'Pending',
    },
    gender:{
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    address:{
        type: String,
    },
    pdf:{
        type:Object,
    },
});

const Manuscript = mongoose.model('Manuscript', ManuscriptSchema);
module.exports = Manuscript;
