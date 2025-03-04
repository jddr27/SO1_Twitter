const _ = require('underscore');
const HashMap = require('hashmap');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
var request = require('request');

const MongoClient = require('mongodb').MongoClient;

var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
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
const IP2 = process.env.API || "localhost"; 
const url = `mongodb://admin:admin@${IP}:27017`;
const DB_NAME = 'sopes1proyecto';
const COLLECTION_NAME = 'tweets';

var q = "";
var send = "";

var structTweets = [{
    alias_usuario: "@chino",
    nombre: "daniel",
    txt: "Hola mundo!!!!! #saludo",
    categoria: "saludo"
}];

var structInfo = {
    totalUsus: 1,
    totalTweets: 2,
    totalCates: 3
};

var structPopu = {
    popuUsu: "daniel",
    cantiUsu: 2,
    popuCate: "saludo",
    cantiCate: 3
};

var structUsu = {
    alias_usuario: "@chino",
    nombre: "daniel",
    cantiUsu: 3
};

var structCate = {
    categoria: "saludo",
    cantiCate: 3
};


app.get('/', (req, res) => {
    res.render('index',{});
});


app.get('/cates', (req, res) => {
    res.render('cates',{});
});


app.get('/usus', (req, res) => {
    res.render('usus',{});
});


app.get('/buscarUsu', (req, res) => {
    q = req.query.txtUsu;
    send = q;
    res.redirect('/usus');
});


app.get('/buscarCate', (req, res) => {
    q = req.query.txtCate;
    send = q;;
    send = send.replace('#', '%23');
    res.redirect('/cates');
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


app.get('/api/cates', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            
        if (err) throw err;
    
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        let q = req.query.q;

        let query = {};
        if (q) {
            q = q.replace('%23', '#');
            query = {
                categoria: new RegExp(q)
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


app.use(express.static(path.join(__dirname, 'public')));

/*setInterval(() => {
    io.emit('message', variable);
}, 100);*/
  

const ioIndex = io
  .of('/ioIndex')
  .on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets del Index');
    setInterval(() => {
        var options = {
            url     : `http://${IP2}:3001/tweets`,
            method  : 'GET',
            jar     : true,
            headers : headers
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let r = JSON.parse(body);
                structTweets=r.tweets;
                structInfo['totalTweets'] = r.total;
            }
        });
    
        ioIndex.emit('tweets10', structTweets);
        ioIndex.emit('infoTotal', structInfo);
        ioIndex.emit('infoPopu', structPopu);
    }, 5000);
    
    
    /*ioIndex.on('disconnect', function () {
        console.log('user disconnected from Index');
    });*/
});


const ioUsus = io
  .of('/ioUsus')
  .on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets del Usus');
    setInterval(() => { 
        var options = {
            url     : `http://${IP2}:3001/tweets?q=${send}`,
            method  : 'GET',
            jar     : true,
            headers : headers
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let r = JSON.parse(body);
                structTweets=r.tweets;
                structUsu['cantiUsu'] = r.total;
                structUsu['nombre'] = r.tweets[0].nombre;
                structUsu['alias_usuario'] = send;
            }
        });
        ioUsus.emit('tweets3', structTweets);
        ioUsus.emit('infoUsu', structUsu);
    }, 5000);
});


const ioCates = io
  .of('/ioCates')
  .on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets del Cates');
    setInterval(() => {
        var options = {
            url     : `http://${IP2}:3001/api/cates?q=${send}`,
            method  : 'GET',
            jar     : true,
            headers : headers
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let r = JSON.parse(body);
                structTweets=r.tweets;
                structCate['cantiCate'] = r.total;
                structCate['categoria'] = q;
            }
        });
        ioCates.emit('tweets3', structTweets);
        ioCates.emit('infoCate', structCate);
    }, 5000);
});


server.listen(3001, function() {
    console.log("Servidor corriendo en el 3001");
});