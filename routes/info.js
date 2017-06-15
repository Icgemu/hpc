var express = require('express');
var router = express.Router();

var es = require('elasticsearch');

var es_client = new es.Client({
  hosts: ['168.168.5.2:19200'],
  log: ['info', 'debug']
});

var q = require("bodybuilder")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET queue name. */
router.get('/q', function (req, res, next) {
  var body = q()
    .aggregation('terms', 'queue', 'queue_agg')
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'body': body
  }, function (err, resp) {
    console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['queue_agg']['buckets']
      res.json(buckets)
    }
  })

});



/* GET jobs name. */
router.get('/jobs', function (req, res, next) {
  var body = q()
    .filter('term', 'queue', req.query['q'])
    .aggregation('terms', 'job', {'size':0},'job_agg')
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
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

/* GET job name. */
router.get('/job', function (req, res, next) {
  var body = q()
    .filter('term', 'job', req.query['q'])
    .sort('time', 'ASC')
    .size(9999)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'body': body
  }, function (err, resp) {
    console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp.hits.hits
      var beginTime = buckets[0]._source.time
      var endTime = buckets[buckets.length -1]._source.time

      var jobInfo = buckets.filter(e=>{
        if(e._source.owner) return true
        return false 
      })[0]

      var jobStats = buckets.filter(e=>{
        if(e._source.resources_used_cpupercent) return true
        return false 
      })[0]

      // console.log(beginTime)
      // console.log(endTime)
      // console.log(JSON.stringify(jobInfo))
      // console.log(JSON.stringify(jobStats))
      var r = {}
      r['st'] = beginTime
      r['et'] = endTime

      r['queue'] = jobInfo._source.queue
      r['owner'] = jobInfo._source.owner
      r['id'] = jobInfo._source.job
      r['name'] = jobInfo._source.job_name

      r['status'] = jobStats._source.exit_status
      r['cpu_percent'] = jobStats._source.resources_used_cpupercent
      r['cpu_t'] = jobStats._source.resources_used_cput
      r['mem'] = jobStats._source.resources_used_mem
      r['cpu_n'] = jobStats._source.resources_used_ncpus
      r['vmem'] = jobStats._source.resources_used_vmem
      r['walltime'] = jobStats._source.resources_used_walltime

      res.json(r)
    }
  })

});


/* GET nodes name. */
router.get('/nodes', function (req, res, next) {
  var body = q()
    .aggregation('terms', 'node', { 'size': 0 }, 'node_agg')
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'type': 'Node',
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


/* GET node info. */
router.get('/node', function (req, res, next) {
  var types = { 'cpu': 'cpu_usage', 'disk': 'disk_usage', 'mem': 'mem_usage' }
  var t = req.query['t'];
  var body = q()
    .filter('term', 'node', req.query['q'])
    .filter('range', types[t], { 'gte': 0 })
    .sort('time', 'ASC')
    .size(9999)
    .build();

  var all_data = [];

  // first we do a search, and specify a scroll timeout
  es_client.search({
    'index': 'hpc.*',
    'type': 'Node',
    '_source': [types[t],'time'],
    'scroll': '30s',
    'body': body
  }, function getMoreUntilDone(err, response) {
    // collect the title from each response

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      response.hits.hits.forEach(function (hit) {
        // console.log(JSON.stringify(hit))
        var r = { 't': hit._source['time'] }
        r[types[t]] = hit._source[types[t]];
        all_data.push(r);
      });

      if (response.hits.total !== all_data.length) {
        // now we can call scroll over and over
        es_client.scroll({
          scrollId: response._scroll_id,
          scroll: '30s'
        }, getMoreUntilDone);
      } else {
        res.json(all_data)
      }
    }
  });

});


/* GET nodes stats. */
router.get('/node_stats/:type/:subtype', function (req, res, next) {
  var types = { 'cpu': 'cpu_usage', 'disk': 'disk_usage', 'mem': 'mem_usage' }
  var subtypes = {'1':10,"2":10000000,'3':10}

  var body = q()
    //.filter('term', 'node', types[req.params['type']])
    .filter('range', types[req.params['type']], { 'gte': 0 })
    .aggregation('terms', 'node', { 'size': 0 }, 'node_agg',(a)=>{
      return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']], "missing": 0}, 'bins')
    })
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'type': 'Node',
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

/* GET time stats. */
router.get('/time_stats/:type/:subtype', function (req, res, next) {
  var types = { 'cpu': 'cpu_usage', 'disk': 'disk_usage', 'mem': 'mem_usage' }
  var subtypes = {'1':10,"2":10000000,'3':10}

  var body = q()
    //.filter('term', 'node', types[req.params['type']])
    .filter('range', types[req.params['type']], { 'gte': 0 })
    .aggregation('date_histogram','time' , {"interval" : "1h","format":'HH',"time_zone": "+08:00"}, 'node_agg', (a)=>{
      return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']]}, 'bins')
    })
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.*',
    'type': 'Node',
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
