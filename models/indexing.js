const mongoose = require('mongoose');

const IndexingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
     image:{
        type:Object,
    },
});

const Indexing = mongoose.model('Indexing', IndexingSchema);
module.exports = Indexing;
