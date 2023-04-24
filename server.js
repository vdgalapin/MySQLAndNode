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

// 04062023
var cookieParser = require('cookie-parser');


// 04072023
var path = require('path');

// initialize url 04062023
// var url = require('url');

// Initialize express
var app = express();

// It parses incoming request with JSON payload and is based on body-parser 04062023
app.use(express.json());
// use to initialize the epxress to parse JSON data to ge the form data 04062023
// It parse incoming url-encoded payloads and is based on a body parser 
app.use(express.urlencoded({extended: true})); 

// to use static files like for css, js in the public folder 04062023
app.use(express.static('public'));

// Set the cookie-parser so that server can access necessary option to save, read, and access a cookie
app.use(cookieParser());

// Create session 04052023
app.use(session({
    secret: '80rnin194nC1ty', // random key to aunthenticate a session. This is stored in environment variable and cant be exposed to the public
    resave: false, // enbales to store back to the session store even if the session was never modified during the request
    saveUninitialized: true, // prevents the browser from using empty session. Allow session to be sent to the store
    cookie: {maxAge: 36000000 } // By Millisecond. Browser will dete cookie after the set duration elapse
}))

var session; // a variable to save a session


// Allow the app to use flash 04052023
app.use(flash());
//  // middleware
// app.use((req, res, next) => {
//     res.locals.message = req.flash("message");
//     next();
//   });

// Use as the default view engine
app.set('view engine', 'ejs')

// use bootstrap 04072023
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.use(express.static('public'));

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
app.get('/', function(req, res) {
    // to remove session
    req.session.destroy();
    res.render('pages/login');
});

// logging in
app.post('/', function(req, res) {

    // this is possible because of express.urlencoded
    var username = req.body['username'];
    var password = req.body['password'];
    
    if (password == '' ||username == '') {
        res.render('pages/login');
    } else {
        var query = "SELECT password, created FROM login where username = '" + username + "' LIMIT 1;"; 
        con.query(query, function(err, result) {
            if (err) {
                ErrorAudit(err);
                res.render('pages/login');
            } else  {
                if (result ===  undefined) {
                    console.log('No username found under ' + username  + '.');
                    res.render('pages/login');
                } else {
                    if (result.length > 0) {
                        var hashpassword = result[0]['password'];
                        var datecreated = result[0]['created'];     
                        if (comparePassword(password, hashpassword)) {
                            // save session
                            req.session = req.session;
                            req.session.userid = username;
                            
                            // let array = JSON.stringify(['test1', 'test2']);
                            // return res.redirect("/profiles?username=" + encodeURIComponent(username)+"&created="+encodeURIComponent(datecreated)+"&array="+encodeURIComponent(array));    
                            return res.redirect("/profiles");
                        } else {
                            console.log('Wrong password');
                            res.render('pages/login');
                        }
                    } else {
                        console.log('No profile found for ' + username);
                        res.render('pages/login');
                    }
                }
            }
        });
    }    
});

// sign up page 
app.get('/signup', function(req, res) {
    // to remove session
    req.session.destroy();
    res.render('pages/signup');
});

// signing up
app.post('/signup', function(req, res) {
    var username = req.body['username'];
    var password = req.body['password'];
    
    if (password == '' ||username == '') {
        res.render('pages/signup');
    } else {
        con.query("SELECT * FROM login where username = '" + username + "';", function(err, result) {
            if (err) {
                ErrorAudit(err);
                res.render('pages/signup');
            } 
            if (result.length > 0) {
                console.logc(username + ' is already in the systems.');
                res.render('pages/signup');
            } else {
                if(hashPassword(username, password)) {
                    res.render('pages/signup');
                } else {
                    return res.redirect('/');
                }
            }
        });
    }  
});

// Log In
app.get('/profiles', function(req,res) {
    // This will render and serve from the client if they have login. 
    session = req.session;
    if(session.userid) {
        var query = "SELECT game_name, game_description, game_made, game_picture, game_path from games;"
        con.query(query, function(err, result){
            if(err) {
                ErrorAudit(err);
                return res.redirect('/');
            } else {
                if(result.length > 0) {
            
                } else {
                    console.log('No games');
                }
                res.render('pages/profiles', {games: result, username: req.session.userid});
            }
        })
      
    } else {
        return res.redirect('/');
    }
});

app.get('/logout', function(req,res) {
    req.session.destroy();
    return res.redirect('/');
});

app.get('/games/snake', function(req, res) {
    session = req.session;
    if(session.userid) {
        res.render('pages/games/snake', {username: req.session.userid, game_id: "1"});
    } else {
        return res.redirect('/');
    }
});

// Set score
app.post('/gamescore',function(req, res) {
    session = req.session;
    if(session.userid) {
        var score = req.body.score;
        var game_id = req.body.gameID;
        var username = req.body.player;

        var date = new Date();
        var current_date = date.toJSON().slice(0, 10).replaceAll('-', '');
        var current_time = date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();

        var query = "INSERT INTO scores(game_id, username, score, date_played, time_played) VALUES(" + game_id + ",'" + username + "', " + score + "," + current_date + "," + current_time + ");"
        con.query(query, function(err, result) {
            if(err) {
                ErrorAudit(err);
            }
            
        }) 

    } else {
        
    }
});

// Get Scores
app.get('/getHighScore', function(req, res) {
    session = req.session;
    if(session.userid) {
      
        var query = 'SELECT username, score, date_played, time_played FROM scores WHERE game_id = ' + req.query.gameID + ' ORDER BY score desc, date_played, time_played';
        con.query(query, function(err, result) {
            console.log(query);
            if(err) {
                ErrorAudit(err);
            } else {
                return res.send(result);
            }
            

        })
    }
});

function hashPassword(username, password) {   
    var error = false;
    bcrypt.hash(password, 10)
    .then(hashpassword => {
        con.query("INSERT INTO login(username, password, created) VALUES('" + username + "', '" + hashpassword + "', " + new Date().toJSON().slice(0, 10).replaceAll('-', '') + ")", function(err, result) {
            if(err) { 
                error = true; 
                ErrorAudit(err);
            } 
            else { 
                if(!(result)) {
                    error = true;
                    ErrorAudit("Failed at hash password");
                } 
            }
        });
    }).catch(err => {
        error = true;
        ErrorAudit(err);
    });
    return error;
}

function comparePassword(password, hashPassword) {
    var result = bcrypt.compareSync(password, hashPassword);
    return result;
}

function ErrorAudit(error) {
    var date = new Date();
    var current_date = date.toJSON().slice(0, 10).replaceAll('-', '');
    var current_time = date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();

    con.query("INSERT INTO error(error_message, date_created, time_created) VALUES('"+error+"',"+current_date+","+current_time+");", function(err, result) {
        if(err) {console.log(err);}
        if(!(result)) {console.log("Failed to insert to error file.");}
    });

}

