import React, { useState } from 'react';
import { Provider, connect } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';

import createStore from '../store';
import signModel from '../../models/signer';
import systemModels from '../../models/system';

const store = createStore([signModel, systemModels]);

console.log(store);

const Root = function() {
  return (
    <Provider store={store}>
      {/* 配置各种全局 provider, eg: Intl-local, context */}
      {/* 配置路由布局 */}
      
      {/* <Router /> */}
      <Profile />
    </Provider>
  )
}

const mapStateToProps = ({ signer }) => ({ signer })
const Profile = connect(mapStateToProps)((props) => {
  const { signer, dispatch } = props;
  const [loginName, setLoginName] = useState('');
  const onClickSignIn = () => {
    dispatch({
      type: 'signer/signin',
      payload: { loginName }
    })
  };
  const onClickSignOut = () => {
    dispatch({
      type: 'signer/signout'
    })
  }
  const onChange = (e) => {
    setLoginName(e.target.value);
  }
  return (
    <React.Fragment>
      <div>LoginName: <input type="text" onChange={onChange} /></div>
      <div>UserName: {signer.isLogin ? signer.userInfo.name : 'N/A'}</div>
      {
        !signer.isLogin 
        ? <button onClick={onClickSignIn}>登录</button>
        : <button onClick={onClickSignOut}>登出</button>
      }
    </React.Fragment>
  )
})



export default Root;