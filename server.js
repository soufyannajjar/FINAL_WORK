// Import express
let express = require("express");

//load path
const path = require('path');

// Inititialize the app
let app = express();


//Inititialize & use EJS
app.set('view engine', 'ejs');


// Configure bodyparser to handle POST requests
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(express.urlencoded({
  extended: true
}));


// Launch server
var port = 8000;
app.listen(port, function () {
  console.log("Running server on port " + port);
});

