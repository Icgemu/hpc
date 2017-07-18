import {bar} from "../../hpc/echart"
exports.Option1 = function (_this) {
    fetch('/node/time_stats/cpu').then((resp) => {
        return resp.json();
    }).then((arr) => {
        
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
        // const mapping = ["大于1天", "小于1天", "小于8小时", "小于1小时", "小于十分钟"]
        // const series_data = series_tmp.map((item, i) => {
        //     return {
        //         "type": "bar",
        //         "name": mapping[i],
        //         "data": x_data.map(e => {
        //             return item[e]
        //         })
        //     }
        // })
        // const option2 = bar(x_data, series_data)
        // option2.legend = {
        //     "data": mapping
        // }

        const x_data = []
        const  data =[]

        arr.map(item =>{
            x_data.push(item.t)
            data.push(item.value)
        })
        // for(var item in arr){
        //     x_data.push(item)
        //     data.push(arr[item])
        // }
       const series_data = [{
                name: 'CPU',
                data: data,
                type: 'line'
            }]
        const option1 = bar(x_data, series_data)

        option1.dataZoom =  [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            start:90,
            end:100
        }
        ],
        option1.title = {
             "text": "平均CPU使用率",
             "subtext": "各节点平均值"
        }
        option1.xAxis.name = "时间"
        option1.yAxis.name = "平均值"
        // _this.setState({option1})
        _this.setState({option1})
    })
}