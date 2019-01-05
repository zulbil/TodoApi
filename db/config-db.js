const mongoose = require('mongoose'); 
var db         = mongoose.connection;

// Connect to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todosApi',{ useNewUrlParser: true });

// Get notified about the connection to the database
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We are successfully connected!"); 
});

module.exports = { mongoose }; 
