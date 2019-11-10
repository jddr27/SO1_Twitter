

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
var request = require('request');
var session = require('express-session');


const IP = process.env.API || "localhost";
const app = express();
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//session
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

// body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.disable('etag');

var sess; // global session

app.get('/login', (req, res) => {               
    res.render('login',{});
    
});

app.get('/register', (req, res) => {               
    res.render('register',{});
    
});

app.get('/', (req, res) => {               
    sess = req.session;
    if(!sess.usu) {
        return res.redirect('/login');
    }

    let q = req.query.q;
    let send = q != undefined ? q : ""; 
    var options = {
        url     : `http://${IP}:3000/tweets?q=${send}`,
        method  : 'GET',
        jar     : true,
        headers : headers
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let r = JSON.parse(body);
            res.render('index', {
              usu: sess.usu,
              tweets: r.tweets,
              total: r.total,
              q: r.q
            });
        }
    });
    //res.render('index',{});
    
});

app.get('/crear', (req, res) => {
            
    let usr = req.query.usr;
    let pass = req.query.pass;

    var options = {
        url     : `http://${IP}:3000/api/usu?usr=${usr}&&pass=${pass}`,
        method  : 'GET',
        jar     : true,
        headers : headers
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.redirect('/login')
        }
    });

})

app.get('/entrar', (req, res) => {

    sess = req.session;
    let usr = req.query.usr;
    let pass = req.query.pass;

    var options = {
        url     : `http://${IP}:3000/usus?q=${usr}`,
        method  : 'GET',
        jar     : true,
        headers : headers
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let r = JSON.parse(body);
            if(r.total == 1){
                if(r.usu[0].password == pass){
                    sess.usu = usr;
                    res.redirect('/');
                }
                else{
                    res.render('login', {mensaje: "Password incorrecta"});
                }
            }
            else{
                res.render('login', {mensaje: "Usuario inexistente"});
            }
        }
    });
})

app.get('/ingresar', (req, res) => {
            
    let usr = req.query.usr;
    let txt = req.query.txt;

    var options = {
        url     : `http://${IP}:3000/api/tweet?usr=${usr}&&txt=${txt}`,
        method  : 'GET',
        jar     : true,
        headers : headers
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.redirect('/')
        }
    });

})

app.get('/tweets', (req, res) => {
            
    let q = req.query.q;
    let send = q != undefined ? q : ""; 
    var options = {
        url     : `http://${IP}:3000/tweets?q=${send}`,
        method  : 'GET',
        jar     : true,
        headers : headers
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let r = JSON.parse(body);
            res.render('tweets', {
              tweets: r.tweets,
              total: r.total,
              q: r.q
            });
        }
    });

});

app.get('/logout', (req, res) => {               
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
    
});

// static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Express server startd on port ${PORT}`));