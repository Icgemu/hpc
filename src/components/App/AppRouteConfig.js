import App from "./app";
import {FixedColumnTableComponent,PaginationTableComponent,ResizableColumnTableComponent,CustomColumnTableComponent,TreeTableComponent} from '../pages/table/FixedColumnTable'
import {PickerExample} from '../pages/picker/index.js'
import {DatePickerApp} from '../pages/datepicker/deploy/app.js'
import {EchartsApp} from '../pages/echarts/index.js'
import {DialogExample,AlertExample} from '../pages/DialogExample'

export const  AppConfig = {
  path:"/",
  naviTo:App,
  navibar:true,
  leftbar:true,
  indexRoute:'a1',
  childs:[
    {
      navibar:{title:"样例管理",path:"a1"},
      // naviTo:Container1,
      indexRoute:'n1',
      leftbar:[
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
          {path:'c2',title:'Alert控件',naviTo:AlertExample}
        ]}
      ],
      router:[
        {path:'c1',title:'Echarts插件1',naviTo:EchartsApp},
        {path:'c2',title:'Echarts插件2',naviTo:EchartsApp}
      ]
    }
  ]
}
