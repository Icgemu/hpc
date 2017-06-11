var express = require('express');
var router = express.Router();

var es = require('elasticsearch');

var es_client = new es.Client({
	hosts:['localhost:9200'],
   log:['info','debug']
});

var q = require("bodybuilder")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET queue name. */
router.get('/q', function(req, res, next) {
  var body = q()
            .aggregation('terms','queue','queue_agg')
            .size(0)
            .build();
  es_client.search({
    'index':'hpc',
    'body':body
  },function(err,resp){
    console.log(JSON.stringify(resp));
    
    if(err){
      res.status(404).json({'error':'Data Not Found!'})
    }else{
      var buckets  = resp['aggregations']['queue_agg']['buckets']
      res.json(buckets)
    }
  })
  
});

/* GET jobs name. */
router.get('/jobs', function(req, res, next) {
  var body = q()
            .filter('term','queue',req.query['q'])
            .aggregation('terms','job','job_agg')
            .size(0)
            .build();
  es_client.search({
    'index':'hpc',
    'body':body
  },function(err,resp){
    console.log(JSON.stringify(resp));
    
    if(err){
      res.status(404).json({'error':'Data Not Found!'})
    }else{
      var buckets  = resp['aggregations']['job_agg']['buckets']
      res.json(buckets)
    }
  })
  
});

/* GET job name. */
router.get('/job', function(req, res, next) {
  var body = q()
            .filter('term','job',req.query['q'])
            .sort('time','ASC')
            .size(9999)
            .build();
  es_client.search({
    'index':'hpc',
    'body':body
  },function(err,resp){
    console.log(JSON.stringify(resp));
    
    if(err){
      res.status(404).json({'error':'Data Not Found!'})
    }else{
      var buckets  = resp.hits.hits
      res.json(buckets)
    }
  })
  
});


/* GET job name. */
router.get('/nodes', function(req, res, next) {
  var body = q()
            .aggregation('terms','node',{'size':0},'node_agg')
            .size(0)
            .build();
  es_client.search({
    'index':'hpc',
    'type':'Node',
    'body':body
  },function(err,resp){
    console.log(JSON.stringify(resp));
    
    if(err){
      res.status(404).json({'error':'Data Not Found!'})
    }else{
      var buckets  = resp['aggregations']['node_agg']['buckets']
      res.json(buckets)
    }
  })
  
});


/* GET job name. */
router.get('/node', function(req, res, next) {
  var types = {'cpu':'cpu_usage','disk':'disk_usage','mem':'mem_usage'}
  var t = req.query['t'];
  var body = q()
            .filter('term','node',req.query['q'])
            .filter('range',types[t],{'gte':0})
            .sort('time','ASC')
            .size(9999)
            .build();
  es_client.search({
    'index':'hpc',
    'type':'Node',
    'fields':[types[t]],
    'body':body
  },function(err,resp){
    // console.log(JSON.stringify(resp));
    
    if(err){
      res.status(404).json({'error':'Data Not Found!'})
    }else{
      var buckets  = resp.hits.hits
      res.json(buckets)
    }
  })
  
});

module.exports = router;
