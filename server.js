// To load node modules
var express = require('express');


// Set mysql
var mysql = require('mysql')

// Initialize express
var app = express();

// Use as the default view engine
app.set('view engine', 'ejs')


// Create the mysql connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Basketball41Mavericks!",
    database: "practice"
})

// Create a port for the website that will run on
var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Now listenting to port ' + port);
});

// Intitial page
app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.get('/profiles', function(req,res) {
    con.query('SELECT * FROM profile', function(err, result) {
        if (err) {
            console.log("Error in");
            throw err;
        } 
        res.render('pages/profiles', {data: result});
    })
    
});


// module.exports = router;