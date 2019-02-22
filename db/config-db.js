const mongoose 	= require('mongoose'); 
var config 		= require('./config.json');
var db         	= mongoose.connection;
var env 	   	= process.env.NODE_DEV || 'development'; 

if(env === 'development' || env === 'test') {
	var envConfig = config[env]; 
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key]; 
	})
}
// Connect to the database
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });

// Get notified about the connection to the database
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We are successfully connected!"); 
});

