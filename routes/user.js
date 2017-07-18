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
module.exports = router;