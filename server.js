var express = require('express');
var app = express();


var fs    = require('fs'),
nconf = require('nconf');

// from: https://github.com/indexzero/nconf
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv()
   .env()
   .file({ file: 'config.json' });

//
// Set a few variables on `nconf`.
//
nconf.set('database:host', '127.0.0.1');
nconf.set('database:port', 5984);
nconf.set('server:port',8080 );

//
// Get the entire database object from nconf. This will output
// { host: '127.0.0.1', port: 5984 }
//
console.log('foo: ' + nconf.get('foo'));
console.log('NODE_ENV: ' + nconf.get('NODE_ENV'));
console.log('database: ' + nconf.get('database'));
console.log('port: ' + nconf.get('server:port'));

var port = nconf.get('server:port') // undefined
//port = process.env.PORT || 8080;

app.set('view engine', 'ejs'); // set up ejs for templating

console.log("Registering endpoint: /");

// =====================================
// HOME PAGE (with login links) ========
// =

app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

app.get('/hello', function(req, res){
    res.send('hello ROOT world');
});

// show the login form
app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
//     req.logout();
     res.redirect('/');
});
// send score
app.get('/scoreboard', function(req, res) {
        res.render('scoreboard.ejs'); 
    });

app.get('/about', function(req, res) {
        res.render('about.ejs'); 
    });

console.log("Registering JSON endpoint: /stubbed");
app.get('/api/v1/getscores', function(req, res){

	var obj = {};
	var score = {}  ;
	var rounds = [] ;
	obj.received = 'ok';
	obj.match = 'ostricourt';
	obj.category = 'women';
	//score.player[0] = 'joueur1';
	//score.player[1] = 'joueur2';
	//rounds.round[0] = score;
	obj.rounds = rounds;

  console.log("sendind scoring");
  res.header('Content-type','application/json');
	res.header('Charset','utf8');

	res.send(JSON.stringify(obj));
});


console.log("Registering endpoint: /stubbed");
app.get('/stubbed', function(req, res){
    res.send('hello STUBBED');
});

console.log("Registering endpoint: /testing");
app.get('/testing', function(req, res){
    res.send('this is a test endpoint');
});

console.log("Registering endpoint: /jsonendpoint");
app.get('/jsonendpoint', function(req, res){
    res.json({
        "mykey" : "myvalue", 
        "testy" : "something", 
        "exnum" : 123
    });
});

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('MyTargetscoreBoard server started on: ' + port);


