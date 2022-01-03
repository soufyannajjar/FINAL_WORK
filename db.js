
// Datebase connection
var mysql = require("mysql")
var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'souf',
  database  : 'emotify'
});
 connection.connect(function(error) { 
     if (error) console.log(error);
    });

    module.exports = connection;