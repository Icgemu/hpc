var express = require('express');
var router = express.Router();

var es = require('elasticsearch');

var es_client = new es.Client({
	hosts:['localhost:9200'],
   log:['info','debug']
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET home page. */
router.get('/q', function(req, res, next) {

  es_client.
  res.render('index', { title: 'Express' });
});

module.exports = router;
