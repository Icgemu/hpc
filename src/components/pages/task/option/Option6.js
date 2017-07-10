import {bar} from "../../hpc/echart"
exports.Option6 = function (_this) {
    fetch('/task/submit_by_hour').then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = arr.map((item,i) => {
           return item.t
        })
       const series_data = [{
                name: '数量',
                data: arr.map((item,i) => {
                    return item.count
                    }),
                type: 'bar'
            }]
        const option6 = bar(x_data, series_data)
        
        option6.title = {
             "text": "任务提交时间点分布"
        }
        option6.xAxis.name = "时间(小时)"
        option6.yAxis.name = "任务数量"
        // _this.setState({option1})
        _this.setState({option6})
    })
}