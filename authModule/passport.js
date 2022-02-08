const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
let connection = require("../db");

module.exports = function (passport) {
  console.log("----- LOGIN -------")
  passport.use(
    new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {

      connection.query("SELECT * from users where email = ? ", email, function (error, resultSQL) {


        if (!resultSQL[0]) {
          return done(null, false, {
            message: "This Email is not registered please try again or register",
          });
        }

        //Check if Password is correct
        bcrypt.compare(password, resultSQL[0].password, (err, isMatch) => {
          if (err) return done(null, false, {
            message: err,
          });

          if (isMatch) {
            return done(null, resultSQL[0]);
          } else {
            return done(null, false, {
              message: "Incorrect password, please try again"
            });
          }

        });
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

};