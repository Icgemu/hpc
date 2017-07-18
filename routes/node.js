var express = require('express');
var router = express.Router();

var es = require('elasticsearch');

var es_client = new es.Client({
  hosts: ['168.168.5.2:19200'],
  log: ['info', 'debug']
});

var q = require("bodybuilder")


/* GET time stats. */
router.get('/time_stats/:type', function (req, res, next) {
  var types = { 'cpu': 'cpu_usage', 'disk': 'disk_usage', 'mem': 'mem_usage' }
//   var subtypes = {'1':10,"2":10000000,'3':10}

  var body = q()
    //.filter('term', 'node', types[req.params['type']])
    .filter('range', types[req.params['type']], { 'gte': 0 })
    // .aggregation('date_histogram','time' , {"interval" : "1h","format":'HH',"time_zone": "+08:00"}, 'node_agg', (a)=>{
    //   return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']]}, 'bins')
    // })
    .aggregation('date_histogram','create_time' , {"interval" : "1m","format":'YYYY-MM-dd HH:mm',"time_zone": "+08:00"}, 'node_agg', (a)=>{
      return a.aggregation('avg', types[req.params['type']],{}, 'avg')
    })
    .size(0)
    .build();
  es_client.search({
    'index': 'hpc.node.*',
    'type': 'stats',
    'body': body
  }, function (err, resp) {
    // console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['node_agg']['buckets']
      var data = buckets.map(item =>{
            const t = item["key_as_string"];
            const value = item["avg"]["value"]
            return {
                "t":t,
                "value":value
            }
      })
      res.json(data)
    }
  })

});

module.exports = router;