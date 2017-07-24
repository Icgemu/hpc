import {bar} from "../../hpc/echart"
exports.Option7 = function (_this) {
    fetch('/task/submit_by_weekday',{credentials: 'include'}).then((resp) => {
        return resp.json();
    }).then((arr) => {
        const m = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
        const x_data = arr.map((item,i) => {
           const t = m[item.t];

           return t
        })
       const series_data = [{
                name: '数量',
                data: arr.map((item,i) => {
                    return item.count
                    }),
                type: 'bar',
                itemStyle:{
                    normal:{
                        color:"#6e7074"
                    }
                }
            }]
        const option7 = bar(x_data, series_data)
        option7.title = {
             "text": "按周几提交任务"
        }
        option7.xAxis.name = "周几"
        option7.yAxis.name = "任务数量"
        // _this.setState({option1})
        _this.setState({option7})
    })
}