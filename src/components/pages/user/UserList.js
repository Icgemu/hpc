import React from 'react';
import {Table, Column, Cell, HeaderCell, TablePagination } from 'rsuite-table';
import {fetchDataList, fetchDataTotal} from './FetchDataList';


const DateCell = ({ rowData, dataKey, ...props }) => (

    <Cell {...props}>
        {(rowData[dataKey] == null? "Null":rowData[dataKey]).toLocaleString()}
    </Cell>
);

function formatLengthMenu(lengthMenu) {
    return (
        <div className="table-length">
            <span> 每页 </span>
            {lengthMenu}
            <span> 条 </span>
        </div>
    );
}

function formatInfo(total, activePage) {
    return (
        <span>共 <i>{total}</i> 条数据</span>
    );
}

const UserTable = React.createClass({
    getInitialState() {
        return {
            displayLength: 100,
            total:0,
            activePage:1,
            data: []
        };
    },
    componentDidMount(){
        fetchDataList(this, 1)
    },
    handleChangePage(dataKey) {
        this.setState({activePage:dataKey})
        fetchDataList(this, dataKey)
    },
    handleChangeLength(dataKey) {
        var {activePage} = this.state
        this.setState({displayLength:dataKey})
        fetchDataList(this,activePage)
    },
    render() {
        const {data, total, displayLength} = this.state;
        return (
            <div>
                <Table  height={400} data={data} resizable>

                     <Column width={200}  align="center"  fixed>
                        <HeaderCell>用户组</HeaderCell>
                        <Cell dataKey="queue" />
                    </Column>

                    <Column width={300}  align="center"  fixed>
                        <HeaderCell>用户名</HeaderCell>
                        <Cell dataKey="owner" />
                    </Column>

                    <Column width={200} resizable >
                        <HeaderCell>平均排队时间</HeaderCell>
                        <Cell dataKey="avg" />
                    </Column>

                    <Column width={200} resizable >
                        <HeaderCell>最大排队时间</HeaderCell>
                        <Cell dataKey="max" />
                    </Column>
                    <Column width={200} resizable >
                        <HeaderCell>最小排队时间</HeaderCell>
                        <Cell dataKey="min" />
                    </Column>

                    <Column width={200} resizable>
                        <HeaderCell>任务数</HeaderCell>
                        <Cell dataKey="count" />
                    </Column>

                </Table>

                {/* <TablePagination
                    formatLengthMenu={formatLengthMenu}
                    formatInfo={formatInfo}
                    displayLength={displayLength}
                    total={total}
                    onChangePage={this.handleChangePage}
                    onChangeLength={this.handleChangeLength}
                    /> */}
            </div>
        );
    }
});

export default UserTable;
