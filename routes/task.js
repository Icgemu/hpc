const Router = require('express-promise-router')
const router = new Router()
var {Client} = require('pg')

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
    const {rows} = await cli.query("select to_char(st, 'YYYY-MM-DD') as t ,job_status, count(*)as cnt from job_result group by t,job_status order by t,job_status;")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

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
      with h as(\
      select to_char(a2.st, 'YYYY-MM-DD') as t ,(a1.create_time - a2.st) as tu,\
        (CASE \
          WHEN (a1.create_time - a2.st) >= interval'1 day' THEN '>=1d'\
          WHEN (a1.create_time - a2.st) >= interval'8 hour' THEN '>=8H' \
          WHEN (a1.create_time - a2.st) >= interval'1 hour' THEN '>=1H'\
          WHEN (a1.create_time - a2.st) >= interval'10 minute' THEN '>=10M'\
          ELSE '<10M' \
        END\
        ) as tu_text\
      from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3\
      )\
      select t, tu_text, count(*) as count from h group by t, tu_text order by t;\
    ")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    res.json(rows)
  } catch (error) {
    res.json({"error":"no data"})
  }
});

router.get('/run_time_hist', async (req, res, next) => {
  try {
    const {rows} = await cli.query("\
      with h as(\
      select to_char(a2.st, 'YYYY-MM-DD') as t ,\
          (CASE \
            WHEN (a2.et - a1.create_time) >= interval'1 day' THEN '>=1d' \
            WHEN (a2.et - a1.create_time) >= interval'8 hour' THEN '>=8H' \
            WHEN (a2.et - a1.create_time) >= interval'1 hour' THEN '>=1H' \
            WHEN (a2.et - a1.create_time) >= interval'10 minute' THEN '>=10M' \
            ELSE '<10M' \
          END\
        ) as tu_text\
      from job_dispatch as a1, job_result as a2 where a1.job_run_id = a2.job_run_id AND a2.job_status < 3\
      )\
      select t, tu_text, count(*) as count from h group by t, tu_text order by t;\
    ")
    // const rs = rows.map(function(element) {
    //   console.log(JSON.stringify(element))
    // }, this);
    res.json(rows)
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