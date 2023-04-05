// To load node modules
var express = require('express');

// for session - login system 04052023
var session = require('express-session');

// for flash messages 04052023
var flash = require('connect-flash');

// Set mysql
var mysql = require('mysql')

// Initialize express
var app = express();

// Create session 04052023
app.use(session({
    secret: 'login_session',
    resave: true,
    saveUninitialized: true // prevents the browser from using empty session
}))

// Allow the app to use flash 04052023
app.use(flash());
//  // middleware
// app.use((req, res, next) => {
//     res.locals.message = req.flash("message");
//     next();
//   });

// Use as the default view engine
app.set('view engine', 'ejs')


// Create the mysql connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Basketball41Mavericks!",
    database: "njandms_proj"
})

// Create a port for the website that will run on
var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Now listenting to port ' + port);
});

// Intitial page
app.get('/', function(req, res) {
    req.flash('message', 'Welcome!');
    res.render('pages/index');
});

app.get('/profiles', function(req,res) {


    var username = req.query['username'];
    var password = req.query['password'];

    if (password == '' ||username == '') {
        return res.redirect('/')
    } else {
        var query = "SELECT * FROM login where username = '" + username + "' and password = '" + password + "'"; 
        con.query(query, function(err, result) {
            if (err) {
                console.log(err);
                // req.flash('Cannot connect to the database!')
                return res.redirect('/')
            } 
            if (result.length > 0) {
                res.render('pages/profiles', {data: result, message: res.locals.message});
            } else {
                // req.flash('No profile found!')
                return res.redirect('/')
            }
            
        })
    }


    
    
});

