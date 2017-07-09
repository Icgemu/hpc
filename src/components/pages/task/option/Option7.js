import {bar} from "../../hpc/echart"
exports.Option7 = function (_this) {
    fetch('/task/submit_by_weekday').then((resp) => {
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
        const option7 = bar(x_data, series_data)
        
        option7.title = {
             "text": "按周几提交任务"
        }
        // _this.setState({option1})
        _this.setState({option7})
    })
}