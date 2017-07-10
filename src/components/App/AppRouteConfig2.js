import App from "../App/app.jsx";
import {FixedColumnTableComponent,PaginationTableComponent,ResizableColumnTableComponent,CustomColumnTableComponent,TreeTableComponent} from '../pages/table/FixedColumnTable'
import {PickerExample} from '../pages/picker/index.js'
import {DatePickerApp} from '../pages/datepicker/deploy/app.js'
import {EchartsApp} from '../pages/echarts/index.js'
import {DialogExample,AlertExample} from '../pages/DialogExample'
import TaskInfo from '../pages/task/TaskInfo'
import TaskList from '../pages/task/TaskList'
export const  AppConfig = {
  path:"/",
  naviTo:App,
  navibar:false,
  leftbar:true,
  indexRoute:'task1',
  childs:[
    {group:'任务分析',childs:[
      {path:'task1',title:'任务概况',naviTo:TaskInfo},
      {path:'task2',title:'任务列表',naviTo:TaskList},
    ]},
    {group:'用户组-用户分析',childs:[
      {path:'user1',title:'用户概况',naviTo:PickerExample},
      {path:'user2',title:'用户信息汇总',naviTo:PickerExample}
    ]},
    {group:'节点分析',childs:[
      {path:'node1',title:'节点概况',naviTo:DatePickerApp},
      {path:'node2',title:'节点执行情况',naviTo:DatePickerApp}
    ]} 
  ],
  route:[
    {path:'c4',title:'Dialog控件2',naviTo:DialogExample}
  ]
}
