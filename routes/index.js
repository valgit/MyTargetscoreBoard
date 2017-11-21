var sqlite3 = require('sqlite3').verbose();

var express = require('express');
var router = express.Router();

var db = new sqlite3.Database('tables.sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/competitions', function(req, res){
        res.header('Charset','utf8');

    db.all("SELECT * FROM competitions", function(err, rows){
				if(err)
          console.log("Error Selecting : %s ",err );

        res.render('competitions',{title:"Test Table",data:rows});
      });

        //res.json({ "competitions" : row });
});

module.exports = router;
