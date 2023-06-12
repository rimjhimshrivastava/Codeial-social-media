const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId
    },
    //defined the object id of the liked object
    likeable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    //used for defining the type of the like onject
    onModel: {
        type: String,
        required: true,
        enum:['Post', 'Comment']
    }
},{
    timestamps: true
});


const Like = mongoose.model('Like', likeSchema );
module.exports = Like;