import { scatter, bar } from "../../hpc/echart"
exports.Option4 = function (_this) {
    fetch('/task/ncpus_dist').then((resp) => {
        return resp.json();
    }).then((arr) => {
        //     const x_data = arr.map((item,i) => {
        //         const a = []
        //         a.push(i)
        //         a.push(item.job_ncpu)
        //         a.push(item.cnt)
        //         return a
        //     })
        //    const series_data = [{
        //             name: 'N_CPUs',
        //             data: x_data,
        //             type: 'scatter'
        //         }]
        const x_data = []
        const data = []
        arr.map((item, i) => {
            var exp = item.n
            if (!exp && typeof (exp) != "undefined" && exp != 0) {
                
            }else{
                x_data.push(item.n)
                data.push(item.cnt)
            }

        })
        const series_data = [{
            name: '数量',
            data: data,
            type: 'bar',
            itemStyle: {
                normal: {
                    color: "#91c7ae"
                }
            }
        }]
        //const option4 = scatter(series_data)
        const option4 = bar(x_data, series_data)

        option4.title = {
            "text": "任务使用CPU资源分布"
        }
        option4.xAxis.name = "任务CPU使用数量"
        option4.yAxis.name = "任务数量"
        // _this.setState({option1})
        _this.setState({ option4 })
    })
}