var { Client } = require('pg')
var es = require('elasticsearch');
var moment = require("moment")
var newPg = function () {
    const cli = new Client({
        "user": 'postgres',
        // "user": "eshgfuu",
        "host": '168.168.5.2',
        // "host": 'localhost',
        "password": 'oio',
        "database": 'hpc',
        "port": 5432
    });
    cli.connect()
    return cli;
}

var cli = newPg()

exports.newPg = newPg
exports.es_client = new es.Client({
  hosts: ['168.168.5.2:19200'],
//   hosts:['localhost:9200'],
  log: ['info', 'debug']
});

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
      const e = mx.add(1,"days").valueOf();
      const s = mx.subtract(1,"months").valueOf();
      console.log(s + "->" + e)
      return stET(s,e,field,where)
  }
};
exports.stET = stET
