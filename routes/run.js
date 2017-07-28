
const Router = require('express-promise-router')
const router = new Router()
var { Client } = require('pg')
const moment = require("moment")
var {newPg, es_client,stET} = require("./config")

// var cli = new Client(
//     {
//         "user": 'postgres',
//         // "user": "eshgfuu",
//         "host": '168.168.5.2',
//         // "host": 'localhost',
//         "password": 'oio',
//         "database": 'hpc',
//         "port": 5432
//     }
// );
// cli.connect()
var cli = newPg();
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

var run = async function () {
    try {

        var { rows } = await cli.query("\
      select id as t, queue, cnt \
      from queue_job_wait_count1 order by id ;\
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
            rows.forEach(function (item) {
                const q = mapping[item.queue]
                if (data[q]) {
                    data[q].push(item)
                } else {
                    data[q] = [];
                    data[q].push(item)
                }
            }, this);
            const result = []
            for (var q in data) {
                const dataList = calTimeList(data[q])
                
                for (var item in dataList) {
                    if(isNaN(dataList[item])){
                        continue
                    }
                    result.push({
                        "t": item,
                        "queue": q,
                        "cnt": dataList[item]
                    })
                    var t = await cli.query("insert into queue_job_wait_count1(id, queue, cnt) values($1,$2,$3);", [item, q, dataList[item]])
                }
                await cli.query("COMMIT");
                console.log(q + "ok.")
            }
        }

    } catch (error) {
        console.log(JSON.stringify(error))
        //res.status(404).json({ "error": "no data" })
    }
}

run()