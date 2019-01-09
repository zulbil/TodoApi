const mongoose      = require('mongoose');
const validator     = require('validator');  
const jwt           = require('jsonwebtoken'); 
const _             = require('lodash'); 
const bcrypt        = require('bcryptjs'); 


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

//This function is make a query to find user with the given token
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

//This function is make a query to find user with the given email 
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this; 

    return User.findOne({email}).then((user)=> {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) resolve(user);
                else reject();
            })
        }) 
    })
}

//Middleware : this function will run right before we save a new user into the database
UserSchema.pre('save', function (next) {
    var user = this; 
    var userPassword = user.password; 
    //Check if a pasword has been updated
    // if yes, we'll hash the given password and store it to the database
    // if no, we'll simply call next 
    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(userPassword, salt, function(err, hash) {
                user.password = hash; 
                next(); 
            });
        });
    } else {
        next(); 
    }

})

var User = mongoose.model('User', UserSchema); 

module.exports = {User}; 