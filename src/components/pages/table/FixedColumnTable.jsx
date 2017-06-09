import React from 'react';
import 'rsuite-table/less/style.less';
import './style.less';

import FixedColumnTable from './examples/FixedColumnTable';
import PaginationTable from './examples/PaginationTable';
import ResizableColumnTable from './examples/ResizableColumnTable';
import CustomColumnTable from './examples/CustomColumnTable';
import TreeTable from './examples/TreeTable';


export const FixedColumnTableComponent = () => <FixedColumnTable/>
export const PaginationTableComponent = () => <PaginationTable/>
export const ResizableColumnTableComponent = () => <ResizableColumnTable/>
export const CustomColumnTableComponent = () => <CustomColumnTable/>
export const TreeTableComponent = () => <TreeTable/>
