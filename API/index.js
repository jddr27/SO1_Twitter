const _ = require('underscore');
const HashMap = require('hashmap');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.disable('etag');

const IP = process.env.DB || "localhost";
// Connection URL
const url = `mongodb://admin:admin@${IP}:27017`;
 
// Database Name
const DB_NAME = 'sopes1proyecto';

const COLLECITON_NAME = 'tweets';


app.get('/', (req, res) => {
    res.redirect('/tweets')
});


app.get('/tweets', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECITON_NAME);

        let q = req.query.q;

        let query = {};
        if (q) {
            q = q.replace('%23', '#');
            query = {
                alias_usuario: new RegExp(q)
            }
        }

        collection.find(query).toArray(function(err, result){
            res.json({
                tweets: result,
                total: result.length,
                q: q
            });
        });
        
    });
});



app.get('/api/tweets', (req, res) => {

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
        console.log("Connected successfully to server");
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECITON_NAME);
        collection.find({}).toArray(function(err, result){
            res.json(result);
        });
        
    });

});

app.get('/api/tweet', (req, res) => {

    let categoria = '#';
    const url = req.url;    
    const catindex = url.indexOf('%23');

    if (catindex >0) {
        const urlcat = req.url.substring(catindex);
        const endindex = urlcat.indexOf('%20');
        if (endindex > 0) {
            categoria = urlcat.substring(0, endindex);
        } else {
            categoria = urlcat;
        }
        
    }
    
    categoria = categoria.replace('%23', '#');

    const usr = req.query.usr;
    const nom = req.query.nom;
    const txt = req.query.txt;

    try {

        const tweet = {
            alias_usuario: usr,
            nombre: nom,
            txt: txt,
            categoria: categoria
        };

        require('./mongo').insert(tweet);

        res.json({
            success: true,
            tweet: tweet
        });
    } catch(e) {
        res.json({
            success: false,
            error: e
        });
    }

});


app.get('/api/delete-tweets', (req, res) => {

    try {
        require('./mongo').delete();

        res.json({
            success: true
        });
    } catch(e) {
        res.json({
            success: false,
            error: e
        });
    }

});

// static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Express server startd on port ${PORT}`));