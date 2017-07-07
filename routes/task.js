const Router = require('express-promise-router')
const router = new Router()
var {Client} = require('pg')

var cli = new Client(
    {
      "user": 'postgres',
      "host": '168.168.5.2',
      "password": 'oio',
      "database": 'hpc',
      "port": 5432
    }
  );
  cli.connect()

router.get('/job_by_day', async (req, res, next) => {
  try {
    const {rows} = await cli.query("select to_char(st, 'YYYY-MM-DD') as t ,job_status, count(*)as cnt from job_result group by t,job_status order by t,job_status;")
    const rs = rows.map(function(element) {
      console.log(JSON.stringify(element))
    }, this);
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

module.exports = router;