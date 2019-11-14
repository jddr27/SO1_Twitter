const _ = require('underscore');
const HashMap = require('hashmap');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.disable('etag');

const IP = process.env.DB || "localhost";
//const url = `mongodb://admin:admin@${IP}:27017`;
const url = `mongodb://admin:admin@104.154.151.0:27017`;
const DB_NAME = 'sopes1proyecto';
const COLLECTION_NAME = 'tweets';


var structTweets = [{
    alias_usuario: "@chino",
    nombre: "daniel",
    txt: "Hola mundo!!!!! #saludo",
    categoria: "#saludo"
}];

var structInfo = {
    totalUsus: 1,
    totalTweets: 2,
    totalCates: 3
};

/*var structPopu = {
    popuUsu: "@chino",
    cantiUsu: 1,
    popuCate: "#saludo",
    cantiCate: 1
};*/

app.get('/', (req, res) => {
    res.render('index',{});
});


app.get('/cates', (req, res) => {
    res.render('cates',{});
});


app.get('/usus', (req, res) => {
    //res.render('usus',{});
    res.sendfile('usus.html');
});


app.get('/tweets', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

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
        const collection = db.collection(COLLECTION_NAME);
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

/*io.on('connection', function(socket) {
    console.log('Alguien se ha conectado con Sockets');
  
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
  
    socket.on('new-message', function(data) {
      messages.push(data);
  
      io.sockets.emit('messages', messages);
    });


    setInterval(() => {
        io.emit('message', variable);
    }, 100);

  });*/
  

const ioIndex = io
  .of('/ioIndex')
  .on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets del Index');
    ioIndex.emit('tweets10', structTweets);
    ioIndex.emit('infoTotal', structInfo);
    //ioIndex.emit('infoPopu', structPopu);
});


const ioUsus = io
  .of('/ioUsus')
  .on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets del Usus');
    ioUsus.emit('hi', 'Hello from Usus');

    ioUsus.on('disconnect', function () {
        console.log('user disconnected from Usus');
    });
});


const ioCates = io
  .of('/ioCates')
  .on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets del Cates');
    ioCates.emit('hi', 'Hello from Cates');

    ioCates.on('disconnect', function () {
        console.log('user disconnected from Cates');
    });
});