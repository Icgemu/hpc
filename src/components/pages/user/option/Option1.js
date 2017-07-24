import {bar} from "../../hpc/echart"
exports.Option1 = function (_this) {
    fetch('/user/wait_time_hist',{credentials: 'include'}).then((resp) => {
        return resp.json();
    }).then((arr) => {
        const x_data = [];
        const x_tmp = {}
        const queue = {}

        arr.forEach((item) => {
            if (!x_tmp[item.t]) {
                //x_data.push(item.t)
                x_tmp[item.t] = 0
                if(queue[item.queue]){
                    if(queue[item.queue][item.t]){
                        queue[item.queue][item.t] = queue[item.queue][item.t] + parseInt(item.cnt)
                    }else{
                        queue[item.queue][item.t] = parseInt(item.cnt)
                    }
                    
                } else{
                    queue[item.queue] = {}
                    queue[item.queue][item.t] = parseInt(item.cnt)
                }
            }
        })
        for(var item in x_tmp){
            x_data.push(item)
        }
        const series_data = []
        for(var q in queue){
            var data = queue[q];
            var y_data = []
            for(var item in x_tmp){
                if(data[item]){
                    y_data.push(data[item])
                }else{
                    y_data.push(0);
                }
            }
             series_data.push({
                "type": "line",
                "name": q,
               // "stack":"总数",
               // "areaStyle": {normal: {}},
                "data": y_data
            })
        }
        const mapping = []

        for(var q in queue){
            mapping.push(q)
        }
        // const status = [0, 1, 2, 3, 4]
        // const series_tmp = status.map((item) => {
        //     return x_data.map(r => {
        //         const x = {}
        //         x[r] = 0;

        //         return x
        //     })
        // })

        // arr.forEach((item) => {
        //     series_tmp[item.job_status][item.t] = item.cnt
        // })
        // const mapping = ["成功", "失败", "取消", "提交", "调度中"]
        // const series_data = series_tmp.map((item, i) => {
        //     return {
        //         "type": "bar",
        //         "name": mapping[i],
        //         "stack":"总数",
        //         "data": x_data.map(e => {
        //             return item[e]
        //         })
        //     }
        // })
        const option1 = bar(x_data, series_data)
        option1.legend = {
            "data": mapping
        }
        option1.dataZoom =  [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            start:90,
            end:100
        }
        ],
        option1.title = {
            "text": "专业组排队数量"
        }
        option1.xAxis.name = "时间"
        option1.yAxis.name = "排队数量"
        _this.setState({option1})
    })
}