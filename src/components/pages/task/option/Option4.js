import {scatter} from "../../hpc/echart"
exports.Option4 = function (_this) {
    fetch('/task/ncpus_dist').then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = arr.map((item,i) => {
            const a = []
            a.push(i)
            a.push(item.job_ncpu)
            a.push(item.cnt)
            return a
        })
       const series_data = [{
                name: 'N_CPUs',
                data: x_data,
                type: 'scatter'
            }]
        const option4 = scatter(series_data)
        
        option4.title = {
             "text": "任务使用CPU资源分布"
        }
        option4.xAxis.name = "任务序列"
        option4.yAxis.name = "CPU数量"
        // _this.setState({option1})
        _this.setState({option4})
    })
}