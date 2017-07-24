import {bar} from "../../hpc/echart"
exports.Option6 = function (_this) {
    fetch('/task/submit_by_hour',{credentials: 'include'}).then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = arr.map((item,i) => {
           return item.t + "点"
        })
       const series_data = [{
                name: '数量',
                data: arr.map((item,i) => {
                    return item.count
                    }),
                type: 'bar',
                itemStyle:{
                    normal:{
                        color:"#bda29a"
                    }
                }
            }]
        const option6 = bar(x_data, series_data)
        option6.title = {
             "text": "任务提交时间点分布"
        }
        option6.xAxis.name = "时间区间"
        option6.yAxis.name = "任务数量"
        // _this.setState({option1})
        _this.setState({option6})
    })
}