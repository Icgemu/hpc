const BarOption = function () {
    return {
        tooltip: {
            trigger: 'axis'
        },
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: []
        },
        series: [
            {
                name: 'cpu',
                type: 'line',
                data: []
            }
        ]
    };
}

const ScatterOption = function () {
    return {
        title: {
            text: '1990 与 2015 年各国家人均寿命与 GDP'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            scale: true
        },
        series: [
            {
                name: '1990',
                data: [],
                type: 'scatter'
            }
        ]
    };
}

exports.bar = function (x_data, series_data) {
    const src = BarOption()
    src.xAxis.data = x_data;
    src.series = series_data;
    return src;
}

exports.scatter = function (series_data) {
    const src = ScatterOption()
    src.series = series_data;
    return src;
}