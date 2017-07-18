import {bar} from "../../hpc/echart"
exports.Option3 = function (_this) {
    fetch('/user/queue_jobs').then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = [];
        const x_tmp = {}
        arr.forEach((item) => {
            if (!x_tmp[item.t]) {
                x_data.push(item.t)
                x_tmp[item.t] = parseInt(item.cnt)
            }else{
                x_tmp[item.t] = x_tmp[item.t] + parseInt(item.cnt)
            }
        })
        const status = [0, 1, 2,3,4]
        const series_tmp = status.map((item) => {
            return x_data.map(r => {
                const x = {}
                x[r] = 0;

                return x
            })
        })

        arr.forEach((item) => {
            if(series_tmp[item.status][item.t]){
                series_tmp[item.status][item.t] = series_tmp[item.status][item.t] + parseInt(item.cnt)
            }else{
                series_tmp[item.status][item.t] =  parseInt(item.cnt)
            }
        })
        const mapping = ["成功", "失败", "取消", "提交" , "调度中"]
        const series_data = series_tmp.map((item, i) => {
            return {
                "type": "bar",
                "name": mapping[i],
                "stack":"总数",
                "data": x_data.map(e => {
                    return item[e]
                })
            }
        })
        const option3 = bar(x_data, series_data)
        option3.legend = {
            "data": mapping
        }
        option3.title = {
            "text": "专业组任务情况",
            "subtext": "任务量（成功|失败|取消|提交|调度中） "
        }
        option3.xAxis.name = "日期"
        option3.yAxis.name = "任务数量"
        _this.setState({option3})
    })
}