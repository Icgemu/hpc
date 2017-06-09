import DialogButton from '../dialog/DialogButton'
import {alertMsg} from '../dialog/Alertmsg'
import React from 'react'

export const DialogExample = ()=>{
  let c = <div> 测试 </div>
  let option = {id:1, title:"Dialog Example" ,component:c,width:300,height:200}
  return (
    <div>
      <DialogButton  className="btn btn-default" option={option}>点击打开</DialogButton>
    </div>
  )
}


export const AlertExample = ()=>{
  let c = <div> 测试 </div>
  let option1 = {id:1, type:'error',msg:"Dialog Example"};
  let option2 = {id:2, type:'info',msg:"Dialog Example"};
  let option3 = {id:3, type:'warn',msg:"Dialog Example"};
  return (
    <div>
      <button  className="btn btn-danger" onClick={e=>{alertMsg(option1)}}>Alert</button>
      <hr/>
      <button  className="btn btn-primary" onClick={e=>{alertMsg(option2)}}>Alert</button>
      <hr/>
      <button  className="btn btn-warning" onClick={e=>{alertMsg(option3)}}>Alert</button>
    </div>
  )
}
