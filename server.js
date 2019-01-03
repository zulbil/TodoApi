const express       = require('express');
const bodyParser    = require('body-parser'); 
const _             = require('lodash');

const {mongoose}    = require('./db/config-db'); 
const {User}        = require('./models/User');
const {Todo}        = require('./models/Todo'); 
const {ObjectID}    = require('mongodb');

const app           = express(); 
const port          = process.env.PORT || 3000; 
app.use(bodyParser.json()); 

app.post('/new/todo', (req, res) => {
    let newTodo = new Todo({
        text: req.body.text
    }); 
    newTodo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(404).send(err);
    })
});

app.get('/todos/:id', (req, res) => {
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
});

app.delete('/todos/remove/:id', (req, res) => {
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
});

app.patch('/todos/edit/:id', (req, res) => {
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
})

//User rest api routes
app.post('/new/user', (req, res) => {
    var body    = _.pick(req.body, ['email', 'password']); 
    var newUser = new User(body); 

    newUser.save().then(() => {
        return newUser.generateAuthToken(); 
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((error) => {
        res.status(400).send(error);
    })
});

app.listen(port, () => {
    console.log('Example app listening on port '+port+'!'); 
});

module.exports = {app}; 