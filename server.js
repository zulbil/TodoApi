const express       = require('express');
const bodyParser    = require('body-parser'); 

var {router}        = require('./app_api/routes/index'); 

require('./db/config-db'); 
const app           = express(); 
const port          = process.env.PORT; 

app.use(bodyParser.json()); 

//Api Routes
app.use('/', router); 

app.listen(port, () => {
    console.log('Connected on port '+port+'!'); 
});

module.exports = {app}; 