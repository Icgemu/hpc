import {bar} from "../../hpc/echart"
exports.Option4 = function (_this) {
    fetch('/node/node_stats/mem',{credentials: 'include'}).then((resp) => {
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
        const mapping = []

        for(var q in queue){
            mapping.push(q)
        }
        mapping.sort((a,b) => {
            a = a.replace(/compute/m,"")
            b = b.replace(/compute/m,"")
            return parseInt(a) - parseInt(b)
        })
        const series_data = []
        for(var i=0; i<mapping.length;i++){
            const q = mapping[i]
        
        //for(var q in queue){
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
            //    "stack":"总数",
            //    "areaStyle": {normal: {}},
                "data": y_data
            })
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
        const option4 = bar(x_data, series_data)

        const selected = {} 
        mapping.forEach(e=>{
            selected[e] = false
        })
        selected[mapping[0]] = true;
        option4.legend = {
            "data": mapping,
            "selected":selected
        }
        option4.dataZoom =  [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter',
            start:95,
            end:100
        }
        ],
        option4.title = {
            "text": "各节点内存平均值",
            "subtext":"分不同节点分析"
        }
        option4.xAxis.name = "时间"
        option4.yAxis.name = "内存平均值"
        _this.setState({option4})
    })
}