const express   = require('express'); 
const router    = express.Router(); 

var userCtrl        = require('./../controllers/Users'); 
var todoCtrl        = require('./../controllers/Todos'); 
var {authenticate}  = require('./../middlewares/authenticate'); 

//Todos Routes
router.post('/new/todo', todoCtrl.todoCreate); 
router.get('/todos', todoCtrl.todoList); 
router.get('/todos/:id', todoCtrl.todoById); 
router.delete('/todos/remove/:id', todoCtrl.todoDelete);
router.patch('/todos/edit/:id', todoCtrl.todoUpdate); 


//Users Routes
router.post('/new/user', userCtrl.userCreate); 
router.get('/user/me', authenticate, userCtrl.userProfile); //Private routes
router.post('/user/login', userCtrl.userLogin); 
router.delete('/user/logout', authenticate, userCtrl.userLogout);

module.exports = {router}; 