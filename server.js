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


// Configure private session
var session = require("cookie-session");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// Configure Authentification with passport
const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
require("./authModule/passport")(passport)


//use flash to display front-end messages
const flash = require('connect-flash');
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// Cookienpm
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make UserObject available in all the app
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  //console.log(res.locals.currentUser);
  next();
})

// Setting middleware
app.use(express.static("public")); //Make the only public folder "public" 
app.use(express.static(path.join(__dirname + '../public')));



// import the file containing the routes into the server
let router = require("./routes");
app.use("/", router);

// Launch server
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("Emotify is Running on port " + port);
});