var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(':memory:');
//

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
// TODO: use nconf
var db = new sqlite3.Database('tables.sqlite3');

app.set('view engine', 'ejs'); // set up ejs for templating

console.log("Registering endpoint: /");

// =====================================
// HOME PAGE (with login links) ========
// =

app.get('/', function(req, res) {
        //res.render('index.ejs'); // load the index.ejs file
				res.render('index', { title: 'MyTarget ScoreBoard' });
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

console.log("Registering JSON endpoint: /api/v1/getscores");
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

console.log("Registering JSON endpoint: /api/v1/getcompetitions");
app.get('/api/v1/getcompetitions', function(req, res){
  res.header('Content-type','application/json');
	res.header('Charset','utf8');

    db.all("SELECT * FROM competitions", function(err, row){
        res.json({ "competitions" : row });
    });
});


app.get('/api/v1/getround/:id', function(req, res){
	var competitionId = req.params.id;

  db.all("select * from rounds where competition_id=$1",competitionId,  function(err, row) {
        if (err) {
                console.error(err.message);
                return res.json({ errors: ['Could not retrieve rounds'] });
        }
        //console.log("dump : "+row);
        //console.log(row.name + ": " + row.round_id);
        res.json({ "rounds" : row });
    });
     
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

var roundRouter = express.Router();
roundRouter.get('/', function(req, res) { });
roundRouter.post('/', function(req, res) { });
roundRouter.get('/:id', function(req, res) { });
roundRouter.patch('/:id', function(req, res) { });
roundRouter.delete('/:id', function(req, res) { });
app.use('/round', roundRouter);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('MyTargetscoreBoard server started on: ' + port);


