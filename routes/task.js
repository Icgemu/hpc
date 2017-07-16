const Router = require('express-promise-router')
const router = new Router()
var {Client} = require('pg')
const moment = require("moment")

var cli = new Client(
    {
      // "user": 'postgres',
      "user": "eshgfuu",
      // "host": '168.168.5.2',
      "host": 'localhost',
      "password": 'oio',
      "database": 'hpc',
      "port": 5432
    }
  );
  cli.connect()

router.get('/job_by_day', async (req, res, next) => {
  try {
    const {rows} = await cli.query("select to_char(st, 'YYYY-MM-DD') as t ,job_status, count(*)as cnt from job_result group by t,job_status order by t,job_status;")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

const calTimeList = function(rows){
    var data = {}
    var start = rows[0].s;
    var end = rows[rows.length-1].e
    start = moment(start).format("YYYY-MM-DD HH:mm")
    end = moment(end).format("YYYY-MM-DD HH:mm")

    start = moment(start)
    end = moment(end)

    while (end.diff(start) >= 0){
      const  t = moment(start).format("YYYY-MM-DD HH:mm")
      data[t] = 0;
      start = start.add(1, 'minutes')
    }
    for(let i =0; i<rows.length; i++) {
      const row = rows[i];
      var s = moment(row.s)
      var e = moment(row.e)
      // console.log(s + '->'+ e)

      var  t1 = moment(s.format("YYYY-MM-DD HH:mm"))
      var  t2 = moment(e.format("YYYY-MM-DD HH:mm"))
      // console.log(t1 + '->'+ t2)

      if(s.diff(t1) == 0){
        var c = data[s.format("YYYY-MM-DD HH:mm")] + 1
        data[s.format("YYYY-MM-DD HH:mm")] = c
      }

      if(t1.diff(t2) == 0){
        continue
      }else{
        //  console.log("diff > 1 minutes")
      }

      while(t2.diff(t1) >= 60*1000){
        t1 = t1.add(1 ,"minutes")
        const f = t1.format("YYYY-MM-DD HH:mm")
        var c = data[f] + 1
        data[f] = c
      }
    }
    return data;
}

router.get('/wait_time_hist', async (req, res, next) => {
  try {
    // const {rows} = await cli.query("\
    //   with h as(\
    //   select to_char(a2.st, 'YYYY-MM-DD') as t ,(a1.create_time - a2.st) as tu,\
    //     (CASE \
    //       WHEN (a1.create_time - a2.st) >= interval'1 day' THEN '>=1d'\
    //       WHEN (a1.create_time - a2.st) >= interval'8 hour' THEN '>=8H' \
    //       WHEN (a1.create_time - a2.st) >= interval'5 hour' THEN '>=5H'\
    //       WHEN (a1.create_time - a2.st) >= interval'2 hour' THEN '>=2H'\
    //       WHEN (a1.create_time - a2.st) >= interval'1 hour' THEN '>=1H'\
    //       WHEN (a1.create_time - a2.st) >= interval'10 minute' THEN '>=10M'\
    //       ELSE '<10M' \
    //     END\
    //     ) as tu_text\
    //   from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3\
    //   )\
    //   select t, tu_text, count(*) as count from h group by t, tu_text order by t;\
    // ")

    const {rows} = await cli.query("\
      select a2.job_id as jid , a2.st as s, a1.create_time as e,  count(distinct a2.job_id) ,  count(a2.job_id) \
      from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 \
      group by jid, s,e order by s;\
    ")
    const data = calTimeList(rows)
    res.json(data)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

router.get('/run_time_hist', async (req, res, next) => {
  try {
    // const {rows} = await cli.query("\
    //   with h as(\
    //   select to_char(a2.st, 'YYYY-MM-DD') as t ,\
    //       (CASE \
    //         WHEN (a2.et - a1.create_time) >= interval'1 day' THEN '>=1d' \
    //         WHEN (a2.et - a1.create_time) >= interval'8 hour' THEN '>=8H' \
    //         WHEN (a2.et - a1.create_time) >= interval'1 hour' THEN '>=1H' \
    //         WHEN (a2.et - a1.create_time) >= interval'10 minute' THEN '>=10M' \
    //         ELSE '<10M' \
    //       END\
    //     ) as tu_text\
    //   from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3\
    //   )\
    //   select t, tu_text, count(*) as count from h group by t, tu_text order by t;\
    // ")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    const {rows} = await cli.query("\
      select a2.job_id as jid , a2.et as e, a1.create_time as s,  count(distinct a2.job_id) ,  count(a2.job_id) \
      from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 \
      group by jid, s,e order by s;\
    ")
    const data = calTimeList(rows)
    res.json(data)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

router.get('/ncpus_dist', async (req, res, next) => {
  try {
    const {rows} = await cli.query("select st , job_ncpu ,1 as cnt from job_result where job_status <3 order by st")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

router.get('/mem_dist', async (req, res, next) => {
  try {
    const {rows} = await cli.query("\
      select ceil((to_number(replace(job_mem,'kb',''),'9999999999999999999')/1000/1000)) as t,count(*)  from job_result where job_status <3 group by t order by t; \
    ")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

router.get('/submit_by_hour', async (req, res, next) => {
  try {
    const {rows} = await cli.query("\
      select extract(hour from create_time) as t ,count(*) from job_submit  group by t order by t;\
    ")
    
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

router.get('/submit_by_weekday', async (req, res, next) => {
  try {
    const {rows} = await cli.query("\
select extract(DOW from create_time) as t ,count(*) from job_submit  group by t order by t;\
    ")
   
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

// router.get('/list', async (req, res, next) => {
//   try {
//     const {rows} = await cli.query("\
//       select count(*) from job_result;\
//     ")
//     const rs = rows.map(function(element) {
//       console.log(JSON.stringify(element))
//     }, this);
//     res.json(rows)
//   } catch (error) {
//     res.json({"error":"no data"})
//   }
// });

router.get('/list/:limit/:offset/:total', async (req, res, next) => {
  const limit = req.params.limit
  const offset = req.params.offset
  var total = parseInt(req.params.total)
  if(total == 0 ) {
    const {rows} = await cli.query("\
      select count(*) from job_result;\
    ")
    total = parseInt(rows[0].count)
  } 
  try {
    const {rows} = await cli.query("\
      select id, job_id, st, et, job_queue, job_owner, job_name, job_exit_status, job_cpupercent, job_cput,  job_mem, job_vmem, job_ncpu, job_walltime, job_status from job_result limit $1 offset $2;\
    ",[limit, offset])
    
    res.status(200).json({
        "data" : rows,
        "total" : total
    })
  } catch (error) {
    res.json({"error":"no data"})
  }
});

module.exports = router;