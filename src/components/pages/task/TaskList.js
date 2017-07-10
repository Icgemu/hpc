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

const PaginationTable = React.createClass({
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
        const {data,total,displayLength} = this.state;
        return (
            <div>
                <Table  height={800} data={data} resizable>

                     <Column width={100}  align="center"  fixed>
                        <HeaderCell>ID</HeaderCell>
                        <Cell dataKey="id" />
                    </Column>

                    <Column width={150}  align="center"  fixed>
                        <HeaderCell>任务ID</HeaderCell>
                        <Cell dataKey="job_id" />
                    </Column>

                    <Column width={250} resizable >
                        <HeaderCell>提交时间</HeaderCell>
                        <Cell dataKey="st" />
                    </Column>

                    <Column width={250} resizable>
                        <HeaderCell>结束时间</HeaderCell>
                        <Cell dataKey="et" />
                    </Column>

                    <Column width={200} resizable>
                        <HeaderCell>用户队列</HeaderCell>
                        <Cell dataKey="job_queue" />
                    </Column>

                    <Column width={200} resizable>
                        <HeaderCell>用户名</HeaderCell>
                        <Cell dataKey="job_owner" />
                    </Column>


                    <Column width={200} resizable>
                        <HeaderCell>任务名称</HeaderCell>
                        <Cell dataKey="job_name" />
                    </Column>

                    <Column width={200} resizable>
                        <HeaderCell>任务执行结果</HeaderCell>
                        <Cell dataKey="job_exit_status" />
                    </Column>

                    <Column width={200} align="right" resizable>
                        <HeaderCell>任务CPU百分比</HeaderCell>
                        <DateCell dataKey="job_cpupercent" />
                    </Column>

                    <Column width={200} align="right" resizable>
                        <HeaderCell>CPUT</HeaderCell>
                        <DateCell dataKey="job_cput" />
                    </Column>

                    <Column width={200} align="right" resizable>
                        <HeaderCell>MEM</HeaderCell>
                        <DateCell dataKey="job_mem" />
                    </Column>

                    <Column width={200} align="right" resizable>
                        <HeaderCell>VMem</HeaderCell>
                        <DateCell dataKey="job_vmem" />
                    </Column>

                    <Column width={200} align="right" resizable>
                        <HeaderCell>CPU数量</HeaderCell>
                        <DateCell dataKey="job_ncpu" />
                    </Column>

                    <Column width={200} align="right" resizable>
                        <HeaderCell>Wall Time</HeaderCell>
                        <DateCell dataKey="job_walltime" />
                    </Column>

                    <Column width={200} align="right" resizable>
                        <HeaderCell>结果</HeaderCell>
                        <DateCell dataKey="job_status" />
                    </Column>

                </Table>

                <TablePagination
                    formatLengthMenu={formatLengthMenu}
                    formatInfo={formatInfo}
                    displayLength={displayLength}
                    total={total}
                    onChangePage={this.handleChangePage}
                    onChangeLength={this.handleChangeLength}
                    />
            </div>
        );
    }
});

export default PaginationTable;
