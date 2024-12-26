const mongoose = require('mongoose');

const editorialBoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    description: {
        type: String, // Store description as HTML
        required: true
    },
    image:{
        type:Object,
        default:{
            fileId:"",
            url:"https://img.freepik.com/free-vector/man-red-shirt-with-white-collar_90220-2873.jpg?size=626&ext=jpg"
        }
    },
});

const EditorialBoard = mongoose.model('EditorialBoard', editorialBoardSchema);
module.exports = EditorialBoard;
