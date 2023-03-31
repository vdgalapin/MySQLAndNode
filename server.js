// To load node modules
var express = require('express');

// Set mysql
var mysql = require('mysql')

// Initialize express
var app = express();

// Create the mysql connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Basketball41Mavericks!",
    database: "practice"
})

// calls the connection to check 
con.connect(function(err) {
    if(err) throw err;
    console.log("Connected!")

    con.query('SELECT * FROM profile', function(err, result) {
        if (err) {
            console.log("Error in");
            throw err;
        } 
        console.log(result);
    })
});

// Create a port for the website that will run on
var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Now listenting to port ' + port);
});

// Intitial page
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname});
});