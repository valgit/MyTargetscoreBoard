var sqlite3 = require('sqlite3').verbose();

var express = require('express');
var router = express.Router();

var db = new sqlite3.Database('MyTargets.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/competitions', function(req, res){
        res.header('Charset','utf8');

    db.all("SELECT * FROM Training", function(err, rows){
				if(err)
          console.log("Error Selecting : %s ",err );

        res.render('competitions',{title:"Competitions",data:rows});
      });

        //res.json({ "competitions" : row });
});

function findTraining(req, res, next) {
    var competitionId = req.params.id;
    var dbRequest = 'SELECT * FROM Training WHERE _id = \'' + competitionId + '\'';

    //console.log(dbRequest);
    db.all(dbRequest, function(error, rows) {
        if(rows.length !== 0) {
            req.training = rows;
            return next();
        }

        res.render('incorrect_training'); /* Render the error page. */            
    });
}

function findRounds(req, res, next) {
	  var competitionId = req.params.id;
    dbRequest = 'SELECT * FROM Round WHERE training = \'' + competitionId + '\'';
    //console.log(dbRequest);
        db.all(dbRequest, function(error, rows) {
            /* Add selected data to previous saved data. */
            req.rounds = rows;
            next();
        
    });
}

function renderTraining(req, res) {
        res.header('Charset','utf8');

    //console.log(renderTraining);
    console.log(req.training);
    console.log(req.rounds);
    res.render('detail', {
			  title:"detail",
        training: req.training,
        rounds: req.rounds
    });
}

router.get('/details/:id', findTraining, findRounds,  renderTraining);

router.get('/about', function(req, res) {
        res.render('about.ejs');
    });

module.exports = router;
