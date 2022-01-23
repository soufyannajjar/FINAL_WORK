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

// Configure private session
var session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);


// Setting middleware
app.use(express.static("public")); //Make the only public folder "public" 
app.use(express.static(path.join(__dirname + '../public')));


// import the file containing the routes into the server
let router = require("./routes");
app.use("/", router);

// Launch server
var port = 8000;
app.listen(port, function () {
  console.log("Running server on port " + port);
});

