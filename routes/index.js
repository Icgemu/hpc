var express = require('express');
var router = express.Router();

// var es = require('elasticsearch');
// var {newPg, es_client,stET} = require("./config")
// var es_client = new es.Client({
//   hosts: ['168.168.5.2:19200'],
//   log: ['info', 'debug']
// });

// var q = require("bodybuilder")

/* GET home page. */
router.get('/time/:st/:et', function (req, res, next) {

  req.session.st = Number(req.params["st"]);
  req.session.et = Number(req.params["et"]);
  res.json({"result":"ok"})
});

/* GET home page. */
router.get('/get_time', function (req, res, next) {

  var s = req.session.st
  var e = req.session.et
  res.json({"st":s,"et":e})
});




module.exports = router;
