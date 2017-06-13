import App from "../App/app.jsx";
import {FixedColumnTableComponent,PaginationTableComponent,ResizableColumnTableComponent,CustomColumnTableComponent,TreeTableComponent} from '../pages/table/FixedColumnTable'
import {PickerExample} from '../pages/picker/index.js'
import {DatePickerApp} from '../pages/datepicker/deploy/app.js'
import {EchartsApp} from '../pages/echarts/index.js'
import {DialogExample,AlertExample} from '../pages/DialogExample'
export const  AppConfig = {
  path:"/",
  naviTo:App,
  navibar:false,
  leftbar:true,
  indexRoute:'n1',
  childs:[
    {group:'表格',childs:[
      {path:'n1',title:'固定行列表格',naviTo:FixedColumnTableComponent},
      {path:'n2',title:'分页表格',naviTo:PaginationTableComponent},
      {path:'n3',title:'可变列宽表格',naviTo:ResizableColumnTableComponent},
      {path:'n4',title:'自定义行数据表格',naviTo:CustomColumnTableComponent},
      {path:'n5',title:'树形固表格',naviTo:TreeTableComponent}
    ]},
    {group:'选择器',childs:[
      {path:'m1',title:'选择器样例',naviTo:PickerExample}
    ]},
    {group:'时间选择器',childs:[
      {path:'b1',title:'时间选择器样例',naviTo:DatePickerApp}
    ]},
    {group:'Echarts',childs:[
      {path:'v1',title:'Echarts插件',naviTo:EchartsApp}
    ]},
    {group:'Dialog',childs:[
      {path:'c1',title:'Dialog控件',naviTo:DialogExample},
      {path:'c2',title:'A lert控件',naviTo:AlertExample}
    ]}
     
  ],
  route:[
    {path:'c3',title:'Dialog控件1',naviTo:DialogExample},
    {path:'c4',title:'Dialog控件2',naviTo:DialogExample},
  ]
}
