var {Todo}          = require('./../models/Todo'); 
var {ObjectID}      = require('mongodb');

var todoCreate = function(req, res) {
    var newTodo = new Todo({
        text: req.body.text
    }); 
    newTodo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    })
}

var todoList = function(req, res ) {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(404).send(err);
    }); 
}
var todoById = function(req, res ) {
    var id = req.params.id; 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send({'response': 'ID is invalid'}); 
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
            res.status(404).send('Todo not found');
        } else {
            res.status(200).send({todo});
        }
    }, (err) => {
        res.status(400).send(err); 
    })
}

var todoDelete = function(req, res ) {
    var id = req.params.id; 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send({'response': 'ID is invalid'}); 
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            res.status(404).send('Todo not found');
        } else {
            res.status(200).send({todo});
        }
    }, (err) => {
        res.status(400).send(err); 
    })
}

var todoUpdate = function(req, res) {
    var id = req.params.id; 
    //in our body we will take only text and completed property
    var body = _.pick(req.body, ['text', 'completed']); 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send({'response': 'ID is invalid'}); 
    }

    if(_.isBoolean(body.completed) && body.completed == true ) {
        body.completedAt = new Date().getTime(); 
    } else {
        body.completed = false; 
        body.completedAt = null; 
    }
    //update query
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send('Todo not found');
        }
        res.status(200).send({todo}); 
    }).catch((err) => {
        res.status(400).send(err);
    })
}

module.exports = {
    todoCreate,
    todoList,
    todoById,
    todoDelete,
    todoUpdate
}