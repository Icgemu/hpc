const Router = require('express-promise-router')
const router = new Router()
var { Client } = require('pg')
const moment = require("moment")

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

router.get('/job_by_day', async (req, res, next) => {
  try {
    const { rows } = await cli.query("select to_char(st, 'YYYY-MM-DD') as t ,job_status, count(*)as cnt from job_result group by t,job_status order by t,job_status;")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    res.json(rows)
  } catch (error) {
    res.json({ "error": "no data" })
  }
});

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
  try {
    
    var { rows } = await cli.query("\
      select id as t, cnt \
      from job_wait_count order by id ;\
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

router.get('/wait_time_hist1', async (req, res, next) => {
  try {
      var { rows } = await cli.query("\
      with h AS(\
    select a1.job_id, a2.job_walltime, (a1.create_time - a2.st) as tu, extract(DAY FROM (a1.create_time - a2.st)) as d,extract(HOUR FROM (a1.create_time - a2.st)) as h,extract(MINUTE FROM (a1.create_time - a2.st)) as m,\
    (CASE \
        WHEN (a1.create_time - a2.st) >= interval'1 day' THEN extract(DAY FROM (a1.create_time - a2.st))||'d'\
        WHEN (a1.create_time - a2.st) >= interval'1 hour' THEN extract(HOUR FROM (a1.create_time - a2.st))||'H'\
        ELSE extract(MINUTE FROM (a1.create_time - a2.st))||'M' \
    END\
    ) as tu_text\
    from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 order by tu\
    )\
    select tu_text, count(DISTINCT job_id) as cnt from h group by tu_text order by cnt desc;\
    ")
      
      res.json(rows)

  } catch (error) {
    console.log(JSON.stringify(error))
    res.status(404).json({ "error": "no data" })
  }
});

router.get('/run_time_hist', async (req, res, next) => {
  try {
   
    var { rows } = await cli.query("\
      select id as t , cnt \
      from job_run_count order by id;\
    ")
    if (rows && rows.length > 0) {
      res.json(rows)
    } else {
      var { rows } = await cli.query("\
        select a2.job_id as jid , a2.et as e, a1.create_time as s,  count(distinct a2.job_id) ,  count(a2.job_id) \
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
        var t =await cli.query("insert into job_run_count(id, cnt) values($1,$2) ;", [item, dataList[item]])
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

const calTimeList1 = function (rows) {
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
    var ncpu = parseInt(row.ncpu)
    if(ncpu >1000){
      console.log( 'ncpu ->'+ ncpu)
    }

    var t1 = moment(s.format("YYYY-MM-DD HH:mm"))
    var t2 = moment(e.format("YYYY-MM-DD HH:mm"))
    // console.log(t1 + '->'+ t2)

    if (s.diff(t1) == 0) {
      const f = s.format("YYYY-MM-DD HH:mm")
      
      var c = data[f] + ncpu
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
      var c = data[f] + ncpu
      data[f] = c
    }
  }
  var time3 = moment()
  console.log(time3.diff(time2) / 1000)
  return data;
}
router.get('/run_cpus_hist', async (req, res, next) => {
  try {
   
    var { rows } = await cli.query("\
      select id as t , cnt \
      from job_run_ncpu order by id;\
    ")
    if (rows && rows.length > 0) {
      res.json(rows)
    } else {
      var { rows } = await cli.query("\
        select a2.job_id as jid , a2.et as e, a1.create_time as s,  sum(a1.job_run_ncpu) as ncpu \
        from job_dispatch as a1, job_result as a2 where a2.job_ncpu >= 0 AND a1.job_run_id = a2.job_run_id AND a2.job_status < 3 \
        group by jid, s,e order by s;\
      ")
      const dataList = calTimeList1(rows)
      const data = []
      for (var item in dataList) {
        data.push({
          "t": item,
          "cnt": dataList[item]
        })
        // console.log(item +"->"+dataList[item])
        var t =await cli.query("insert into job_run_ncpu(id, cnt) values($1,$2) ;", [item, dataList[item]])
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

router.get('/ncpus_dist', async (req, res, next) => {
  try {
    
    const { rows } = await cli.query("select job_ncpu as n , count(*) as cnt from job_result where job_status <3 group by n order by n")
    res.json(rows)
  } catch (error) {
    res.json({ "error": "no data" })
  }
});

router.get('/mem_dist', async (req, res, next) => {
  try {
    const { rows } = await cli.query("\
      select ceil((to_number(replace(job_mem,'kb',''),'9999999999999999999')/1000/1000)) as t,count(*)  from job_result where job_status <3 group by t order by t; \
    ")
    
    res.json(rows)
  } catch (error) {
    res.json({ "error": "no data" })
  }
});

router.get('/submit_by_hour', async (req, res, next) => {
  try {
    const { rows } = await cli.query("\
      select extract(hour from create_time) as t ,count(*) from job_submit  group by t order by t;\
    ")

    res.json(rows)
  } catch (error) {
    res.json({ "error": "no data" })
  }
});

router.get('/submit_by_weekday', async (req, res, next) => {
  try {
    const { rows } = await cli.query("\
select extract(DOW from create_time) as t ,count(*) from job_submit  group by t order by t;\
    ")

    res.json(rows)
  } catch (error) {
    res.json({ "error": "no data" })
  }
});


router.get('/list/:limit/:offset/:total', async (req, res, next) => {
  const limit = req.params.limit
  const offset = req.params.offset
  var total = parseInt(req.params.total)
  if (total == 0) {
    const { rows } = await cli.query("\
      select count(*) from job_result;\
    ")
    total = parseInt(rows[0].count)
  }
  try {
    const { rows } = await cli.query("\
      select id, job_id, st, et, job_queue, job_owner, job_name, job_exit_status, job_cpupercent, job_cput,  job_mem, job_vmem, job_ncpu, job_walltime, job_status from job_result limit $1 offset $2;\
    ", [limit, offset])

    res.status(200).json({
      "data": rows,
      "total": total
    })
  } catch (error) {
    res.json({ "error": "no data" })
  }
});

module.exports = router;