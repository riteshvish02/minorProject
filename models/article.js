const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true,
       
    },
    keyword: {
        type: String,
        required: true
    },
    doi: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
    },
    abstract:{
        type: String,
        required: true,
    },
    pdf:{
        type:Object,
    },
    image:{
        type:Object,
    },
    year:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Year',
    },
    issue:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issues',
    },
    view:{
        type: Number,
        default: 1,
    }
},{timestamps:true});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
