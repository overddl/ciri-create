import { call, put } from 'redux-saga/effects';
import * as ActionTypes from './actionTypes';
import { getAppConfig } from '../services/signer';

export default {
  namespace: "system",
  state: {
    pending: false,
    error: { code: null, msg: '' },
    config: {}
  },
  effects: {
    *query() {
      const res = yield call(getAppConfig);
      if(res && res.success) {
        yield put({
          type: ActionTypes.APP_GET_CONFIG,
          payload: res.data
        });
        resolve();
      }else {
        reject(data);
      }
    }    
  },
  reducers: {
    fetchInit(state) {
      return { ...state, pending: true };
    },
    fetchFinish(state) {
      return { ...state, pending: false };
    },
    fetchFailure(state, action) {
      const error = Object.assign({}, aciton.payload);
      return { ...state, error };
    },
    resetError(state) {
      const error = { code: null, msg: '' };
      return { ...state, error }
    },
    fetchConfig(action) {
      const _config = { ...action.payload };
      return { ...state, config: _config, pending: true };
    }
  }
}