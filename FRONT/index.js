const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
var request = require('request');


const IP = process.env.API || "localhost";
const app = express();
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.disable('etag');


app.get('/', (req, res) => {               
    res.render('index',{});
    
});

app.get('/ingresar', (req, res) => {
            
    let usr = req.query.usr  || "";
    let nom = req.query.nom  || "";
    let txt = req.query.txt || "";

    var options = {
        url     : `http://${IP}:3000/api/tweet?usr=${usr}&&nom=${nom}&&txt=${txt}`,
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

// static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Express server startd on port ${PORT}`));