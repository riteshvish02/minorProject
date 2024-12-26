const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    issueName:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type:String,
        enum: ['Publish', 'Unpublish'],
        default: 'Unpublish'
    },
    year: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Year'
    },
    articles:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }
    ]
});

const Issue = mongoose.model('Issues', IssueSchema);
module.exports = Issue;
