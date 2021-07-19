import { call, put, takeLatest } from 'redux-saga/effects';
import { signIn, signOut } from '../services/signer';

export default {
  namespace: "signer",
  state: {
    isLogin: false,
    userInfo: {}
  },
  effects: {
    *main() {
      yield takeLatest('signer/signin', this.signIn);
      yield takeLatest('signer/signout', this.signOut);
    },
    *signIn(action) {
      const { loginName } = action.payload;
      yield put({ type: 'showLoading' });
      try {
        const res = yield call(signIn, loginName);
        yield sessionStorage.setItem('@INFO', JSON.stringify(res));
        yield put({ 
          type: "signer/signInSuccess",
          payload: res
        });
      } catch(err) {
        yield put({ type: 'system/error', payload: JSON.stringify(err) });
      }
    },
    *signOut() {
      const res = yield call(signOut);
      yield sessionStorage.removeItem('@INFO');
      yield put({ type: "signer/signOutSuccess"});
    }
  },
  reducers: {
    signInSuccess(state, action) {
      const userInfo = Object.assign({}, action.payload);
      return {...state, userInfo: userInfo, isLogin: true};
    },
    signOutSuccess(state) {
      return { ...state, userInfo: {}, isLogin: false }
    }
  }
}