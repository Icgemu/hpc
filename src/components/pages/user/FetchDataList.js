import fetch from 'isomorphic-fetch';

exports.fetchDataList = function(_this, page){

    var {displayLength,total} = _this.state
    var offset = (page - 1) *  displayLength
    var url = `/user/owner_jobs_wait_time`
    fetch(url).then((resp) => {
        return resp.json();
    }).then((arr) => {
        _this.setState({"data":arr})
    })

}

// exports.fetchDataTotal = function(_this){

//     fetch('/task/list').then((resp) => {
//         return resp.json();
//     }).then((obj) => {
//         _this.setState({total:obj.total})
//     })

// }