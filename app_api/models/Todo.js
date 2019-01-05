const mongoose = require('mongoose'); 
var Todo  = mongoose.model('Todo', {
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
    }
}); 

module.exports = {Todo}; 