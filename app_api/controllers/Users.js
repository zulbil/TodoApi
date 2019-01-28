const _             = require('lodash');
var {User}          = require('./../models/User'); 
var {ObjectID}      = require('mongodb');

var userCreate = function (req, res) {
    var body    = _.pick(req.body, ['email', 'password']); 
    var newUser = new User(body); 

    newUser.save().then(() => {
        return newUser.generateAuthToken(); 
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((error) => {
        res.status(400).send(error);
    })
}

var userProfile = function (req, res) {
    res.status(200).send(req.user); 
}

var userLogin = function (req, res) {
    var body    = _.pick(req.body, ['email', 'password']); 

    User.findByCredentials(body.email, body.password).then((user)=> {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((error) => {
        res.status(400).send(error);
    })
}

var userLogout = function (req, res) {
    var User    = req.user; 
    var token   = req.token; 

    User.removeToken(token).then(() => {
        res.status(204).send(); 
    }).catch((error) => {
        res.status(400).send(error); 
    })
}
module.exports = {
    userCreate,
    userProfile,
    userLogin, 
    userLogout
}