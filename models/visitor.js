const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
    view:{
        type: Number,
        default: 100000
    }
}, { timestamps: true });

const Visit = mongoose.model('Visit', VisitSchema);
module.exports = Visit;
