// To load node modules
var express = require('express');

// for session - login system 04052023
var session = require('express-session');

// for flash messages 04052023
var flash = require('connect-flash');

// Set mysql
var mysql = require('mysql');

// initialize bcrypt 04062023  
var bcrypt = require('bcrypt');

// initialize url 04062023
var url = require('url');

// Initialize express
var app = express();
// use to initialize the epxress to parse JSON data to ge the form data 04062023
app.use(express.urlencoded({extended: true})); 

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

// login page
app.get('/login', function(req, res) {
        res.render('pages/login');
});

// loggin in
app.post('/login', function(req, res) {

    var username = req.body['username'];
    var password = req.body['password'];

    if (password == '' ||username == '') {
        res.render('pages/login');
    } else {
        var query = "SELECT password, created FROM login where username = '" + username + "' LIMIT 1;"; 
        con.query(query, function(err, result) {
            if (err) {
                console.log(err);
                res.render('pages/login');
            } 
            if (result.length > 0) {
                var hashpassword = result[0]['password'];
                var datecreated = result[0]['created'];
                // console.log('password: ' + password  + '   hash password: ' + hashpassword);     
                var error = comparePassword(password, hashpassword);
                if (error) {
                    res.render('pages/login');
                } else {
                    let array = JSON.stringify(['test1', 'test2']);
                    return res.redirect("/profiles?username=" + encodeURIComponent(username)+"&created="+encodeURIComponent(datecreated)+"&array="+encodeURIComponent(array))
                    // return res.redirect(url.format({
                    //     pathname: "/profiles",
                    //     query: {
                    //         "username": username,
                    //         "created": datecreated,
                    //         "array": array
                    //     }
                    // }));
                    // res.render('pages/profiles', {username: username});
                    // const query = querystring
                    // return res.redirect('/profiles', {username: username});
                }
            } else {
                console.log('No profile found for ' + username);
                res.render('pages/login');
            }
        });
    }    
});

// sign up page 
app.get('/signup', function(req, res) {
    res.render('pages/signup');
});

// signing up
app.post('/signup', function(req, res) {
    var username = req.body['username'];
    var password = req.body['password'];
    
    if (password == '' ||username == '') {
        console.log('No username and/or password');
        res.render('pages/signup');
    } else {
        console.log('Signing Up');
        console.log('username: ' + username + '  password: ' + password);
        var query = "SELECT * FROM login where username = '" + username + "';"; 
        con.query(query, function(err, result) {
            if (err) {
                console.log('Query: ' + err);
                res.render('pages/signup');
            } 
            if (result.length > 0) {
                console.log(username + ' is already in the systems.');
                res.render('pages/signup');
            } else {
                var error = hashPassword(username, password);
                if(error) {
                    console.log('Hashing' + err);
                    res.render('pages/signup');
                } else {
                    // return res.redirect('/login');
                    // res.render('pages/login')
                }
            }
        });
    }  
});

// Log In
app.get('/profiles', function(req,res) {
    res.render('pages/profiles');
});


function hashPassword(username, password) {
    console.log('Enter hashpassword');
    var error = false;
    bcrypt.hash(password, 10)
    .then(hashpassword => {
        console.log('Hashing the password entered');
        const date =  new Date().toJSON().slice(0, 10).replaceAll('-', '');
        var query = "INSERT INTO login(username, password, created) VALUES('" + username + "', '" + hashpassword + "', " + date + ")";
        console.log(query);
        con.query(query, function(err, result) {
            if(err) {
                error = true;
                console.log('Insert: ' + err);
                return error;
            } else {
                console.log(result);
            }
        })
    })
    .catch(err => {
        error = true;
        console.log('Error Hashing:' + err);
        return error;
    })

    return error;
}

function comparePassword(password, hashPassword) {
    console.log('Enter compare password');
    var error = false;
    bcrypt.compare(password, hashPassword)
    .then(result => {
        console.log('result: ' + result);
    })
    .catch(err => {
        error = true;
        console.log('Compare password: ' + err);
        return error;
    })

    return error;
}