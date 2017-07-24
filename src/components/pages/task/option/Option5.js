import {bar} from "../../hpc/echart"
exports.Option5 = function (_this) {
    fetch('/task/mem_dist',{credentials: 'include'}).then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = []
        const data = []
        arr.map((item, i) => {
            var exp = item.t
            if (!exp && typeof (exp) != "undefined" && exp != 0) {
               
            }else{
                x_data.push(item.t + "G")
                data.push(item.count)
            }

        })
        // const x_data = arr.map((item,i) => {
        //     var exp = item.t
        //     if (!exp && typeof(exp)!="undefined" && exp!=0) {
        //         return item.t + "G"
        //     }
           
        // })
       const series_data = [{
                name: 'MEM',
                data: data,
                type: 'bar',
                itemStyle:{
                    normal:{
                        color:"#ca8622"
                    }
                }
            }]
        const option5 = bar(x_data, series_data)
        option5.title = {
             "text": "任务使用内存资源分布"
        }
        option5.xAxis.name = "内存使用量区间"
        option5.yAxis.name = "任务数量"
        // _this.setState({option1})
        _this.setState({option5})
    })
}