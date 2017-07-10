import {bar} from "../../hpc/echart"
exports.Option5 = function (_this) {
    fetch('/task/mem_dist').then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = arr.map((item,i) => {
           return item.t
        })
       const series_data = [{
                name: 'MEM',
                data: arr.map((item,i) => {
                    return item.count
                    }),
                type: 'bar'
            }]
        const option5 = bar(x_data, series_data)
        
        option5.title = {
             "text": "任务使用内存资源分布"
        }
        option5.xAxis.name = "内存使用量区间(GB)"
        option5.yAxis.name = "任务数量"
        // _this.setState({option1})
        _this.setState({option5})
    })
}