var express = require('express');
var router = express.Router();

var es = require('elasticsearch');

var es_client = new es.Client({
  hosts: ['localhost:9200'],
  log: ['info', 'debug']
});

var q = require("bodybuilder")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;
