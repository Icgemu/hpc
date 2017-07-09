import {bar} from "../../hpc/echart"
exports.Option1 = function (_this) {
    fetch('/task/job_by_day').then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = [];
        const x_tmp = {}
        arr.forEach((item) => {
            if (!x_tmp[item.t]) {
                x_data.push(item.t)
                x_tmp[item.t] = 1
            }
        })
        const status = [0, 1, 2, 3, 4]
        const series_tmp = status.map((item) => {
            return x_data.map(r => {
                const x = {}
                x[r] = 0;

                return x
            })
        })

        arr.forEach((item) => {
            series_tmp[item.job_status][item.t] = item.cnt
        })
        const mapping = ["成功", "失败", "取消", "提交", "调度中"]
        const series_data = series_tmp.map((item, i) => {
            return {
                "type": "bar",
                "name": mapping[i],
                "data": x_data.map(e => {
                    return item[e]
                })
            }
        })
        const option1 = bar(x_data, series_data)
        option1.legend = {
            "data": mapping
        }
        option1.title = {
            "text": "每天任务量执行情况(最近一周)",
            "subtext": "每天任务量（成功|失败|取消|提交|调度中） "
        }
        _this.setState({option1})
    })
}