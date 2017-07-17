import {bar} from "../../hpc/echart"
exports.Option3 = function (_this) {
    fetch('/task/run_cpus_hist').then((resp) => {
    // fetch('/task/run_time_hist').then((resp) => {
        return resp.json();
    }).then((arr) => {
        // const x_data = [];
        // const series_tmp = []
        // arr.forEach((item) => {
        //     var  t = item.tu_text
        //     t = t.replace(/d/g, "天")
        //     t = t.replace(/H/g, "小时")
        //     t = t.replace(/M/g, "分钟")
        //     x_data.push(t)
        //     series_tmp.push(item.count)
        // })
        
        // const series_data = [
        //     {
        //         "type": "bar",
        //         "name": "等待调度时间区间",
        //         "data": series_tmp
        //     }
        // ]
        // const option2 = bar(x_data, series_data)
        
        // option2.title = {
        //     "text": "任务等待调度时长区间",
        //     "subtext": "每个区间任务数"
        // }
        // const x_data = [];
        // const x_tmp = {}
        // arr.forEach((item) => {
        //     if (!x_tmp[item.t]) {
        //         x_data.push(item.t)
        //         x_tmp[item.t] = 1
        //     }
        // })
        // const status = {">=1d":0, ">=8H":1, ">=1H":2, ">=10M":3, "<10M":4}
        // const series_i =[0,1,2,3,4] 
        // const series_tmp = series_i.map((item) => {
        //     return x_data.map(r => {
        //         const x = {}
        //         x[r] = 0;
        //         return x
        //     })
        // })

        // arr.forEach((item) => {
        //     series_tmp[status[item.tu_text]][item.t] = item.count
        // })
        // const mapping = ["大于1天", "大于8小时", "大于1小时", "大于10分钟", "小于十分钟"]
        // const series_data = series_tmp.map((item, i) => {
        //     return {
        //         "type": "bar",
        //         "name": mapping[i],
        //         "data": x_data.map(e => {
        //             return item[e]
        //         })
        //     }
        // })

        const x_data = []
        const  data =[]

        arr.map(item =>{
            x_data.push(item.t)
            data.push(item.cnt)
        })
        
        // for(var item in arr){
        //     x_data.push(item)
        //     data.push(arr[item])
        // }
       const series_data = [{
                name: '排队数量',
                data: data,
                type: 'line',
                itemStyle:{
                    normal:{
                        color:"#749f83"
                    }
                }
            }]
        const option3 = bar(x_data, series_data)
        option3.dataZoom =  [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            start:90,
            end:100
        }
        ],
        option3.title = {
             "text": "运行任务数",
             "subtext": "每个时间点运行任务数量"
        }
        option3.xAxis.name = "时间"
        option3.yAxis.name = "运行任务数"
        // _this.setState({option1})
        _this.setState({option3})
    })
}