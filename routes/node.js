const Router = require('express-promise-router')
const router = new Router()
// var { Client } = require('pg')
const moment = require("moment")
var {newPg, es_client,stET} = require("./config")
// var es = require('elasticsearch');

// var es_client = new es.Client({
//   hosts: ['168.168.5.2:19200'],
//   // hosts:['localhost:9200'],
//   log: ['info', 'debug']
// });

var q = require("bodybuilder")


// var cli = new Client(
//   {
//     "user": 'postgres',
//     // "user": "eshgfuu",
//     "host": '168.168.5.2',
//     // "host": 'localhost',
//     "password": 'oio',
//     "database": 'hpc',
//     "port": 5432
//   }
// );
// cli.connect()
var cli = newPg()

/* GET time stats. */
router.get('/time_stats/:type', function (req, res, next) {
  var types = { 'cpu': 'cpu_usage', 'disk': 'disk_usage', 'mem': 'mem_usage' }
//   var subtypes = {'1':10,"2":10000000,'3':10}

  var query = q()
    //.filter('term', 'node', types[req.params['type']])
    .filter('range', types[req.params['type']], { 'gte': 0 })
    // .aggregation('date_histogram','time' , {"interval" : "1h","format":'HH',"time_zone": "+08:00"}, 'node_agg', (a)=>{
    //   return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']]}, 'bins')
    // })
    .aggregation('date_histogram','create_time' , {"interval" : "10m","format":'YYYY-MM-dd HH:mm',"time_zone": "+08:00"}, 'node_agg', (a)=>{
      return a.aggregation('avg', types[req.params['type']],{}, 'avg')
    })
    .size(0);
    let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    if(st && et){
      //const b = moment(st).format("YYYY-MM-DD")
      //const e = moment(et).format("YYYY-MM-DD")
      query.filter('range', "create_time", { 'gte': st, 'lt':et })
    }
    var body = query.build();
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


/* GET time stats. */
router.get('/node_stats/:type', function (req, res, next) {
  var types = { 'cpu': 'cpu_usage', 'disk': 'disk_usage', 'mem': 'mem_usage' }
//   var subtypes = {'1':10,"2":10000000,'3':10}

  var query = q()
    //.filter('term', 'node', types[req.params['type']])
    .filter('range', types[req.params['type']], { 'gte': 0 })
    // .aggregation('date_histogram','time' , {"interval" : "1h","format":'HH',"time_zone": "+08:00"}, 'node_agg', (a)=>{
    //   return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']]}, 'bins')
    // })
    .aggregation('date_histogram','create_time' , {"interval" : "10m","format":'YYYY-MM-dd HH:mm',"time_zone": "+08:00"}, 'node_agg', (a)=>{
      return a.aggregation('terms', "node_name",{}, 'nodes',(e)=>{
        return e.aggregation('avg', types[req.params['type']],{}, 'avg')
      })
    })
    .size(0);
    let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    if(st && et){
      //const b = moment(st).format("YYYY-MM-DD")
      //const e = moment(et).format("YYYY-MM-DD")
      query.filter('range', "create_time", { 'gte': st, 'lt':et })
    }
    var body = query.build();
  es_client.search({
    'index': 'hpc.node.*',
    'type': 'stats',
    'body': body
  }, function (err, resp) {
    // console.log(JSON.stringify(resp));

    if (err) {
      console.log(JSON.stringify(err));
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var data=[]
      var buckets = resp['aggregations']['node_agg']['buckets']
      buckets.forEach(function(b) {
        const t = b["key_as_string"]
        const nodes = b["nodes"]["buckets"]
        nodes.forEach(function(c){
          const node = c["key"]
          const value = c["avg"]["value"]
          data.push({
               "t":t,
              "queue":node,
              "cnt":value
          })
        })
      }, this);
      
      res.json(data)
      //res.json(resp)
    }
  })

});



/* GET time stats. */
router.get('/stats/:type', function (req, res, next) {
  var types = { 'cpu': 'cpu_usage', 'disk': 'disk_usage', 'mem': 'mem_usage' }
//   var subtypes = {'1':10,"2":10000000,'3':10}

  var query = q()
    //.filter('term', 'node', types[req.params['type']])
    .filter('range', types[req.params['type']], { 'gte': 0 })
    // .aggregation('date_histogram','time' , {"interval" : "1h","format":'HH',"time_zone": "+08:00"}, 'node_agg', (a)=>{
    //   return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']]}, 'bins')
    // })
    .aggregation('terms','node_name' , {"size":0}, 'node_agg', (a)=>{
      return a.aggregation('date_histogram', "create_time",{"interval" : "1M","format":'YYYY-MM',"time_zone": "+08:00"}, 'nodes',(e)=>{
        return e.aggregation('stats', types[req.params['type']],{}, 'stats')
      })
    })
    .size(0);
    // let st = req.session.st;
    // let et = req.session.et;
    // // console.log("log=>"+JSON.stringify(req.session))
    // if(st && et){
    //   //const b = moment(st).format("YYYY-MM-DD")
    //   //const e = moment(et).format("YYYY-MM-DD")
    //   query.filter('range', "create_time", { 'gte': st, 'lt':et })
    // }
    var body = query.build();
  es_client.search({
    'index': 'hpc.node.*',
    'type': 'stats',
    'body': body
  }, function (err, resp) {
    // console.log(JSON.stringify(resp));

    if (err) {
      console.log(JSON.stringify(err));
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var data=[]
      var buckets = resp['aggregations']['node_agg']['buckets']
      buckets.forEach(function(b) {
        const t = b["key"]
        const nodes = b["nodes"]["buckets"]
        nodes.forEach(function(c){
          const node = c["key_as_string"]
          const min = c["stats"]["min"]
          const max = c["stats"]["max"]
          const avg = c["stats"]["avg"]
          // data.push({
          //      "t":t,
          //     "queue":node,
          //     "cnt":value
          // })
          console.log(t+","+node+","+min+","+max+","+avg)
        })
      }, this);
      
      res.json(data)
      //res.json(resp)
    }
  })

});

var mapping = {
    "safety_cae1_1":"safety_cae",
    "body_cae":"body_cae",
    "inte_cae1":"inte_cae",
    "safety_cae1":"safety_cae",
    "safety_cae2":"safety_cae",
    "nvh_cae1":"nvh_cae",
    "pwt_cae1":"pwt_cae",
    "chassis_cae1":"chassis_cae",
    "pwt_cae3":"pwt_cae",
    "nvh_cae2":"nvh_cae",
    "newenergy_cae1":"newenergy_cae",
    "pwt_cae2":"pwt_cae",
    "vip":"vip",
    "nvh_cae3":"nvh_cae",
    "pwt_cae4":"pwt_cae",
    "chassis_cae4":"chassis_cae",
    "chassis_cae2":"chassis_cae",
    "chassis_cae3":"chassis_cae",
    "newenergy_cae3":"newenergy_cae"
}


// var stET = function(st,et,field,where){
//   if(st && et){
//       const b = moment(st).format("YYYY-MM-DD")
//       const e = moment(et).format("YYYY-MM-DD")
//       if(where){
//           return "  where "+ field +">='" + b +"' AND " + field +" < '"+ e +"' ";
//       }else{
//           return " "+ field +">='" + b +"' AND " + field +" < '"+ e +"' ";
//       }
//   }else{
//     return ""
//   }
// }

router.get('/node_jobs', async (req, res, next) => {
  try {
    let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    var t = await stET(st,et,"a2.st",false)
    const { rows } = await cli.query("\
      select  a1.job_run_node as n, a2.job_queue as queue, count(distinct a2.job_id) as cnt\
      from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 AND "+t+" \
      group by n,queue order by n,queue,cnt DESC\
    ")

    const data = rows.map(item =>{
        return {
            "queue":mapping[item.queue],
            "t":item.n,
            "cnt":item.cnt
        }
    })
    res.json(data)
  } catch (error) {
    console.log(JSON.stringify(error))
    res.json({ "error": "no data" })
  }
});

module.exports = router;