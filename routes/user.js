const Router = require('express-promise-router')
const router = new Router()
var { Client } = require('pg')
const moment = require("moment")
var es = require('elasticsearch');

var cli = new Client(
  {
    "user": 'postgres',
    // "user": "eshgfuu",
    "host": '168.168.5.2',
    // "host": 'localhost',
    "password": 'oio',
    "database": 'hpc',
    "port": 5432
  }
);
cli.connect()

var es_client = new es.Client({
  hosts: ['168.168.5.2:19200'],
//   hosts:['localhost:9200'],
  log: ['info', 'debug']
});

var q = require("bodybuilder")

const calTimeList = function (rows) {
    var dff = 1;
    var data = {}
    var start = rows[0].s;
    var end = rows[rows.length - 1].e
    start = moment(start).format("YYYY-MM-DD HH:mm")
    end = moment(end).format("YYYY-MM-DD HH:mm")

    start = moment(start)
    end = moment(end)
    var time1 = moment()
    while (end.diff(start) >= 0) {
        const t = moment(start).format("YYYY-MM-DD HH:mm")
        data[t] = 0;
        start = start.add(dff, 'minutes')
    }
    var time2 = moment()
    console.log(time2.diff(time1) / 1000)
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        var s = moment(row.s)
        var e = moment(row.e)
        // console.log(s + '->'+ e)

        var t1 = moment(s.format("YYYY-MM-DD HH:mm"))
        var t2 = moment(e.format("YYYY-MM-DD HH:mm"))
        // console.log(t1 + '->'+ t2)

        if (s.diff(t1) == 0) {
            const f = s.format("YYYY-MM-DD HH:mm")
            var c = data[f] + 1
            data[f] = c
        }

        if (t1.diff(t2) == 0) {
            continue
        } else {
            //  console.log("diff > 1 minutes")
        }

        while (t2.diff(t1) >= dff * 60 * 1000) {
            t1 = t1.add(dff, "minutes")
            const f = t1.format("YYYY-MM-DD HH:mm")
            var c = data[f] + 1
            data[f] = c
        }
    }
    var time3 = moment()
    console.log(time3.diff(time2) / 1000)
    return data;
}
router.get('/wait_time_hist', async (req, res, next) => {
  var query = q()
    //.filter('term', 'node', types[req.params['type']])
    // .filter('range', types[req.params['type']], { 'gte': 0 })
    // .aggregation('date_histogram','time' , {"interval" : "1h","format":'HH',"time_zone": "+08:00"}, 'node_agg', (a)=>{
    //   return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']]}, 'bins')
    // })
    .aggregation('terms','job_time' , {"size":0,"order":{"_term":"ASC"}}, 'node_agg', (a)=>{
        return a.aggregation('terms','job_queue' , {"size":0}, 'queue', (b)=>{
            return b.aggregation('value_count', "job_id", {}, 'value_count')
        })
    })
    .size(0);
    let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    if(st && et){
      const b = moment(st).format("YYYY-MM-DD")
      const e = moment(et).format("YYYY-MM-DD")
      query.filter('range', "job_time", { 'gte': b, 'lt':e })
    }
    var body = query.build();
  es_client.search({
    'index': 'hpc.job.*',
    'type': 'wait',
    'body': body
  }, function (err, resp) {
    // console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['node_agg']['buckets']
      var dataList = []

      buckets.forEach(item=>{
        const t = item.key
        const b = item["queue"]["buckets"]
        const tmp = {}; 
        b.forEach(e =>{
            const q = mapping[e.key]
            const cnt = e["value_count"].value
            if(tmp[q]) {
                tmp[q] = tmp[q] + cnt
            }else{
                tmp[q] = cnt
            }
        })
        for(var qu in tmp){
            dataList.push({
                "t": t,
                "queue":qu,
                "cnt": tmp[qu]
            })
        }
      })
    //   var data = buckets.map(item =>{
    //         const t = item["key"];
    //         const value = item["value_count"]["value"]
    //         return {
    //             "t":t,
    //             "value":value
    //         }
    //   })
      res.json(dataList)
    }
  })
})
router.get('/wait_time_hist__', async (req, res, next) => {
    try {

        var { rows } = await cli.query("\
      select id as t, queue, cnt \
      from queue_job_wait_count1 where cnt >0 order by id ;\
    ")
        if (rows && rows.length > 0) {
            res.json(rows)
        } else {
            var { rows } = await cli.query("\
      select a2.job_queue as queue, a2.job_id as jid , a2.st as s, a1.create_time as e,  count(distinct a2.job_id) ,  count(a2.job_id) \
      from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 \
      group by queue,jid, s,e order by s;\
    ")
            var data = {}
            rows.forEach(function(item) {
                const q = item.queue
                if(data[q]){
                    data[q].push(item)
                }else{
                    data[q] = [];
                    data[q].push(item)
                }
            }, this);
            const result =[]
            for(var q in data){
                const dataList = calTimeList(data[q])
                for (var item in dataList) {
                    result.push({
                        "t": item,
                        "queue":q,
                        "cnt": dataList[item]
                    })
                    var t = await cli.query("insert into queue_job_wait_count1(id, queue, cnt) values($1,$2,$3);", [item, q, dataList[item]])
                    // console.log(JSON.stringify(t))
                }
            }
            
            await cli.query("COMMIT");
            res.json(data)
        }

    } catch (error) {
        console.log(JSON.stringify(error))
        res.status(404).json({ "error": "no data" })
    }
});

router.get('/wait_time_hist1', async (req, res, next) => {
  var query = q()
    //.filter('term', 'node', types[req.params['type']])
    // .filter('range', types[req.params['type']], { 'gte': 0 })
    // .aggregation('date_histogram','time' , {"interval" : "1h","format":'HH',"time_zone": "+08:00"}, 'node_agg', (a)=>{
    //   return a.aggregation('histogram', types[req.params['type']],{"interval" : subtypes[req.params['subtype']]}, 'bins')
    // })
    .aggregation('terms','job_time' , {"size":0,"order":{"_term":"ASC"}}, 'node_agg', (a)=>{
      return a.aggregation('value_count', "job_id", {}, 'value_count')
    })
    .size(0);
    let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    if(st && et){
      const b = moment(st).format("YYYY-MM-DD")
      const e = moment(et).format("YYYY-MM-DD")
      query.filter('range', "job_time", { 'gte': b, 'lt':e })
    }
    var body = query.build();
  es_client.search({
    'index': 'hpc.job.*',
    'type': 'wait',
    'body': body
  }, function (err, resp) {
    // console.log(JSON.stringify(resp));

    if (err) {
      res.status(404).json({ 'error': 'Data Not Found!' })
    } else {
      var buckets = resp['aggregations']['node_agg']['buckets']
      var data = buckets.map(item =>{
            const t = item["key"];
            const value = item["value_count"]["value"]
            return {
                "t":t,
                "cnt":value
            }
      })
      res.json(data)
    }
  })
})
router.get('/wait_time_hist1__', async (req, res, next) => {
  try {
    
    var { rows } = await cli.query("\
      select id as t, cnt \
      from job_wait_count where cnt >0 order by id ;\
    ")
    if (rows && rows.length > 0) {
      res.json(rows)
    } else {
      var { rows } = await cli.query("\
      select a2.job_id as jid , a2.st as s, a1.create_time as e,  count(distinct a2.job_id) ,  count(a2.job_id) \
      from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 \
      group by jid, s,e order by s;\
    ")
      const dataList = calTimeList(rows)
      const data = []
      for (var item in dataList) {
        data.push({
          "t": item,
          "cnt": dataList[item]
        })
        var t = await cli.query("insert into job_wait_count(id, cnt) values($1,$2);", [item, dataList[item]])
        // console.log(JSON.stringify(t))
      }
      await cli.query("COMMIT");
      res.json(data)
    }

  } catch (error) {
    console.log(JSON.stringify(error))
    res.status(404).json({ "error": "no data" })
  }
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

var stET = async function(st,et,field,where){
  if(st && et){
      const b = moment(st).format("YYYY-MM-DD")
      const e = moment(et).format("YYYY-MM-DD")
      if(where){
          return "  where "+ field +">='" + b +"' AND " + field +" < '"+ e +"' ";
      }else{
          return " "+ field +">='" + b +"' AND " + field +" < '"+ e +"' ";
      }
  }else{
      const { rows } = await cli.query("select max(st) as mx from job_result;")
      const mx = moment(rows[0].mx)
      const e = mx.add(1,"days").format("YYYY-MM-DD")
      const s = mx.subtract(1,"months").format("YYYY-MM-DD")
      console.log(s + "->" + e)
      return stET(s,e,field,where)
  }
}


router.get('/queue_jobs', async (req, res, next) => {
  try {
      let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    var t = stET(st,et,"st",true)
    const { rows } = await cli.query("\
select job_queue,job_status,count(*) from job_result "+t+"group by job_queue,job_status order by job_queue,job_status;\
    ")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    const data = rows.map(item =>{
        return {
            "t":mapping[item.job_queue],
            "status":item.job_status,
            "cnt":item.count
        }
    })
    res.json(data)
  } catch (error) {
    res.json({ "error": "no data" })
  }
});

router.get('/owner_jobs', async (req, res, next) => {
  try {
       let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    var t = stET(st,et,"st",true)
    const { rows } = await cli.query("\
select job_queue, job_owner,job_status,count(*) as cnt from job_result "+t+"group by job_queue, job_owner,job_status order by cnt DESC;\
    ")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    const data = rows.map(item =>{
        return {
            "t":item.job_owner+"("+ mapping[item.job_queue]+")",
            "status":item.job_status,
            "cnt":item.cnt
        }
    })
    res.json(data)
  } catch (error) {
    res.json({ "error": "no data" })
  }
});
const formatT = function (t) {
    var hour = t['hours'] ? t["hours"] : 0;
    var minutes = t['minutes'] ? t["minutes"] : 0;
    var seconds = t['seconds'] ? t["seconds"] : 0;
    return hour + "小时" + minutes + "分" + seconds + "秒"
}
router.get('/owner_jobs_wait_time', async (req, res, next) => {
  try {
       let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    var t = stET(st,et,"a2.st",false)
    const { rows } = await cli.query("\
        with h as(\
            select EXTRACT(EPOCH FROM(a1.create_time - a2.st)) as tu, a2.job_queue as queue, a2.job_owner as owner, a2.job_id as jid\
            from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3  AND"+t+" group by tu,queue,owner,jid\
        )\
        select queue, owner, avg(tu) * INTERVAL '1 second' as t, count(*) as count ,\
        max(tu) * INTERVAL '1 second' as mxt,\
        min(tu) * INTERVAL '1 second' as mint\
        from h group by queue, owner  order by t DESC;\
    ")
    
    const data = rows.map(item =>{
        // var t =  item.t;
        // var hour = t['hours']?t["hours"]:0;
        // var minutes = t['minutes']?t["minutes"]:0;
        // var seconds = t['seconds']?t["seconds"]:0;
        return {
            "queue":item.queue,
            "owner":item.owner,
            "avg":formatT(item.t) ,
            "max":formatT(item.mxt) ,
            "min":formatT(item.mint) ,
            "count":item.count
        }
    })
    res.json(data)
  } catch (error) {
      console.log(JSON.stringify(error))
    res.json({ "error": "no data" })
  }
});


router.get('/queue_wait_time_hist', async (req, res, next) => {
    try {
        let st = req.session.st;
    let et = req.session.et;
    // console.log("log=>"+JSON.stringify(req.session))
    var t = stET(st,et,"a2.st",false)
        var { rows } = await cli.query("\
      with h AS(\
    select a2.job_queue, a1.job_id, a2.job_walltime, (a1.create_time - a2.st) as tu, extract(DAY FROM (a1.create_time - a2.st)) as d,extract(HOUR FROM (a1.create_time - a2.st)) as h,extract(MINUTE FROM (a1.create_time - a2.st)) as m,\
    (CASE \
        WHEN (a1.create_time - a2.st) >= interval'1 day' THEN extract(DAY FROM (a1.create_time - a2.st))||'d'\
        WHEN (a1.create_time - a2.st) >= interval'1 hour' THEN extract(HOUR FROM (a1.create_time - a2.st))||'H'\
        ELSE extract(MINUTE FROM (a1.create_time - a2.st))||'M' \
    END\
    ) as tu_text\
    from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 AND "+t+" order by tu\
    )\
    select tu_text, job_queue,count(DISTINCT job_id) as cnt from h group by tu_text,job_queue order by cnt desc;\
    ")

        // res.json(rows)
        const data = rows.map(item => {
            return {
                "queue": mapping[item.job_queue],
                "t": item.tu_text,
                "cnt": item.cnt
            }
        })
        res.json(data)
    } catch (error) {
        console.log(JSON.stringify(error))
        res.status(404).json({ "error": "no data" })
    }
});

router.get('/queue_mem_hist', async (req, res, next) => {
    try {
        let st = req.session.st;
    let et = req.session.et;
    console.log("log=>"+JSON.stringify(req.session))
    var t = stET(st,et,"st",false)
        var { rows } = await cli.query("\
      with h as (\
        select ceil((to_number(replace(job_mem,'kb',''),'9999999999999999999')/1000/1000)) as t, \
            job_queue, count(*) as cnt  from job_result where job_status <3  AND job_mem !='' AND "+t+" group by t ,job_queue order by t\
        )\
        select\
            (CASE WHEN t <= 8 THEN '0~8G'\
            WHEN t <= 16 THEN '8~16G' \
            WHEN t <= 32 THEN '16~32G'\
            WHEN t <= 64 THEN '32~64G'\
            WHEN t <= 128 THEN '64~128G'\
            ELSE '128G ~ 以上' \
            END\
            ) as tu_text ,job_queue, sum(cnt) as cnt \
        from h  group by tu_text,job_queue order by tu_text,job_queue ; \
")

        // res.json(rows)
        const data = rows.map(item => {
            return {
                "queue": mapping[item.job_queue],
                "t": item.tu_text,
                "cnt": item.cnt
            }
        })
        res.json(data)
    } catch (error) {
        console.log(JSON.stringify(error))
        res.status(404).json({ "error": "no data" })
    }
});

module.exports = router;