const mongoose = require('mongoose');

const YearSchema = new mongoose.Schema({
    year: {
        type:Number,
        required: true,
        unique: true
    },
    issues:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Issues'
        }
    ],
    articles:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }
    ]
});

const Year = mongoose.model('Year', YearSchema);
module.exports = Year;
