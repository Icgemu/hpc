var express = require('express');
var router = express.Router();

var es = require('elasticsearch');

var es_client = new es.Client({
  hosts: ['168.168.5.2:19200'],
  log: ['info', 'debug']
});

var q = require("bodybuilder")

/* GET home page. */
router.get('/job_by_day', function (req, res, next) {

  var body = q()
    .filter('exists', 'job')
    .aggregation('date_histogram', 'time', {'interval':'1d','time_zone':'+08:00'},'job_agg',(e)=>{
      return e.aggregation('cardinality','job','job_count');
    })
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'type' : 'Job',
    'body': body
  }, function (err, resp) {
    console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['job_agg']['buckets']
      res.json(buckets)
    }
  })
  
});


/* GET home page. */
router.get('/job_by_day_queue', function (req, res, next) {

  var body = q()
    .filter('exists', 'queue')
    .aggregation('date_histogram', 'time', {'interval':'1d','time_zone':'+08:00'},'job_agg',(e)=>{
      return e.aggregation('terms','queue','queue_name',(e)=>{
        return e.aggregation('cardinality','job','job_count');
      });
    })
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'type' : 'Job',
    'body': body
  }, function (err, resp) {
    console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['job_agg']['buckets']
      res.json(buckets)
    }
  })
  
});


/* GET home page. */
router.get('/task_by_node', function (req, res, next) {

  var body = q()
    .filter('exists', 'exec_vnodes')
    .aggregation('terms', 'exec_vnodes.exec_vnode',{'size':0}, 'node_agg',(e)=>{
      return e.aggregation('cardinality','job','job_count');
    })
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'type' : 'Job',
    'body': body
  }, function (err, resp) {
    console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['node_agg']['buckets']
      res.json(buckets)
    }
  })
  
});

/* GET home page. */
router.get('/task_vnodes', function (req, res, next) {

  var body = q()
    .filter('exists', 'exec_vnodes')
    .aggregation('terms', 'job',{'size':0}, 'node_agg',(e)=>{
      return e.aggregation('value_count','job','vnodes_count');
    })
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'type' : 'Job',
    'body': body
  }, function (err, resp) {
    console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['node_agg']['buckets']
      res.json(buckets)
    }
  })
  
});


module.exports = router;
