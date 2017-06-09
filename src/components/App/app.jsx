import React from 'react'
import TopHeader from '../Header/TopHeader'
import './default.css'
//import '../../../lib/B-JUI/BJUI/themes/css/FA/css/font-awesome.min.css'
import styles from './app.scss'
import Dialog from '../dialog/Dialog'
import Taskbar from '../dialog/Taskbar'
import Alertmsg from '../dialog/Alertmsg'
import {connect} from 'react-redux'
class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
      let dialogs = this.props.dialog.map(option=>{
        return (
          <Dialog option={option}/>
        )
      });

      let alerts = this.props.alerts.map(option=>{
        return (
          <Alertmsg {...option} />
        )
      });

      return (
        <div className={styles.window}>
          <TopHeader/>
          {this.props.children}
          <Taskbar/>
          {dialogs}
          {alerts}
        </div>
      );
    }
}

const mapStateToProps = (state,ownProps) => {
  let {dialog, alerts} = state
  return {
    dialog: [...dialog],
    alerts:[ ...alerts]
  }
}

export default connect(
  mapStateToProps
)(App)
