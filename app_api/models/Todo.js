const mongoose = require('mongoose'); 
var TodoSchema  = new mongoose.Schema({
    text: { 
        type: String,
        required: true,
        trim: true,
        minlength: 1 
    }, 
    completed: { 
        type: Boolean,
        default: null 
    },
    completedAt: { 
        type: String,
        default: false  
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId, 
        require: true
    }
}); 

var Todo = mongoose.model('Todo', TodoSchema); 

module.exports = {Todo}; 