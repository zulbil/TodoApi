const express       = require('express');
const bodyParser    = require('body-parser'); 

const {mongoose}    = require('./db/config-db'); 
const {User}        = require('./models/User');
const {Todo}        = require('./models/Todo'); 
const {ObjectID}    = require('mongodb');

const app           = express(); 
const port          = process.env.PORT || 3000; 
app.use(bodyParser.json()); 

app.post('/new/user', (req, res) => {
    let newUser = new User({
        email: req.body.email
    }); 
    newUser.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    })
});

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

app.delete('/todos/:id', (req, res) => {
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

app.put('todos/:id', (req, res) => {
    var id = req.params.id; 

    if(!ObjectID.isValid(id)) {
        return res.status(404).send({'response': 'ID is invalid'}); 
    }

    //update query
})

app.listen(port, () => {
    console.log('Example app listening on port '+port+'!'); 
});

module.exports = {app}; 