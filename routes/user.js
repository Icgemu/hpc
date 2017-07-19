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

router.get('/queue_jobs', async (req, res, next) => {
  try {
    const { rows } = await cli.query("\
select job_queue,job_status,count(*) from job_result group by job_queue,job_status order by job_queue,job_status;\
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
    const { rows } = await cli.query("\
select job_queue, job_owner,job_status,count(*) as cnt from job_result group by job_queue, job_owner,job_status order by cnt DESC;\
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
    const { rows } = await cli.query("\
        with h as(\
            select EXTRACT(EPOCH FROM(a1.create_time - a2.st)) as tu, a2.job_queue as queue, a2.job_owner as owner, a2.job_id as jid\
            from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 group by tu,queue,owner,jid\
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
        var { rows } = await cli.query("\
      with h AS(\
    select a2.job_queue, a1.job_id, a2.job_walltime, (a1.create_time - a2.st) as tu, extract(DAY FROM (a1.create_time - a2.st)) as d,extract(HOUR FROM (a1.create_time - a2.st)) as h,extract(MINUTE FROM (a1.create_time - a2.st)) as m,\
    (CASE \
        WHEN (a1.create_time - a2.st) >= interval'1 day' THEN extract(DAY FROM (a1.create_time - a2.st))||'d'\
        WHEN (a1.create_time - a2.st) >= interval'1 hour' THEN extract(HOUR FROM (a1.create_time - a2.st))||'H'\
        ELSE extract(MINUTE FROM (a1.create_time - a2.st))||'M' \
    END\
    ) as tu_text\
    from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3 order by tu\
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

module.exports = router;