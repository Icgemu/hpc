const option =  {
    tooltip : {
        trigger: 'axis'
    },
    yAxis:  {
        type: 'value'
    },
    xAxis: {
        type: 'category',
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    series: [
        {
            name: 'cpu',
            type: 'line',         
            data: [320, 302, 301, 334, 390, 330, 320]
        }
    ]
};


exports.bar = function(x_data , series_data){
    const src = Object.assign({},option);
    src.xAxis.data = x_data;
    src.series = series_data;
    return src;
}