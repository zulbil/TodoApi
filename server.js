const express       = require('express');
const bodyParser    = require('body-parser'); 

var {mongoose}      = require('./db/config-db'); 
var {router}        = require('./app_api/routes/index'); 

const app           = express(); 
const port          = process.env.PORT || 3000; 

app.use(bodyParser.json()); 

//Api Routes
app.use('/', router); 

app.listen(port, () => {
    console.log('Connected on port '+port+'!'); 
});

module.exports = {app}; 