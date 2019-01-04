const mongoose      = require('mongoose');
const validator     = require('validator');  
const jwt           = require('jsonwebtoken'); 
const _             = require('lodash'); 

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            }, 
            message: 'This is not a valid email'
        }
    },
    password: {
        type: String, 
        minlength: 6,
        require: true
    },
    tokens: [{
        access: {
            type: String, 
            require: true
        },
        token: {
            type: String, 
            require: true
        }
    }]
}); 

//Here, we are overriding the response when we save a user
// For security reason, the client just need to have back a user id and email
UserSchema.methods.toJSON = function () {
    var user        = this; 
    var userObject  = user.toObject();

    return _.pick(userObject, ['_id', 'email']); 
}

// We are not using arrow function because arrow function cannot bind this keyword
UserSchema.methods.generateAuthToken = function () {
    var user    = this; 
    var access  = 'auth'; 
    var token   = jwt.sign({_id: user._id.toHexString(), access }, 'abc123').toString(); 

    user.tokens.push({ access, token }); 

    return user.save().then(() =>{ 
        return token; 
    })
}

UserSchema.statics.findByToken = function (token) {
    var User = this; 
    var decoded; 
    try {
        decoded = jwt.verify(token, 'abc123'); 
    } catch (error) {
        // return new Promise((resolve, reject) => {
        //     reject(); 
        // }); 
        return Promise.reject(); 
    }

    return User.findOne({
        '_id': decoded._id, 
        'tokens.token': token,
        'tokens.access': 'auth'
    }); 
}

var User = mongoose.model('User', UserSchema); 

module.exports = {User}; 