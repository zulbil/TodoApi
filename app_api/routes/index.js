const express   = require('express'); 
const router    = express.Router(); 

var userCtrl        = require('./../controllers/Users'); 
var todoCtrl        = require('./../controllers/Todos'); 
var {authenticate}  = require('./../middlewares/authenticate'); 

//Todos Routes
router.post('/new/todo', authenticate, todoCtrl.todoCreate); 
router.get('/todos', authenticate, todoCtrl.todoList); 
router.get('/todos/:id',authenticate, todoCtrl.todoById); 
router.delete('/todos/remove/:id',authenticate, todoCtrl.todoDelete);
router.patch('/todos/edit/:id', todoCtrl.todoUpdate); 


//Users Routes
router.post('/user/signup', userCtrl.userCreate); 
router.get('/user/profile', authenticate, userCtrl.userProfile); //Private routes
router.post('/user/login', userCtrl.userLogin); 
router.delete('/user/logout', authenticate, userCtrl.userLogout);

module.exports = {router}; 