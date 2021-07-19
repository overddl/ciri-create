/**
 * store 管理
 * 1. 配置 middlewares, sagaMiddlewares promiseMiddlewares
 * 2. 获取model.effects
 * 3. 获取model.reducers
 * 4. 获取model.subscribe
 * 5. 导出model 挂载方法
 * 6. 执行得到最终 redux-store 并导出
 */
import createStore from './createStore';
import createSagaMiddleware from 'redux-saga';
import createPromisMiddleware from './createPromiseMiddleware';
import getReducer from './getReducer';
import getSaga from './getSaga';

/**
 * create redux store by models.
 * @param {Array<Model: (namepace, state, ?effects, reducers)>} models
 * @returns {Object} store
 */
function create(models) {
  const sagaMiddleware = createSagaMiddleware(); // saga 中间件
  // const promiseMiddleware = createPromisMiddleware(); // promise 中间件
  const middlewares = [sagaMiddleware]; // 之后可以继续添加middleware

  const sagas = [];
  const reducers = {};

  for (const m of models) {
    reducers[m.namespace] = getReducer(m.reducers, m.state, m);
    if(m.effects && m.effects.main) {
      sagas.push(getSaga(m.effects, m));
    }
  }

  const store = createStore({ reducers, initialState: {}, middlewares, extraEnhancers: [] });

  // 支持store单独加载非model下的saga;
  store.runSaga = sagaMiddleware.run;

  sagas.forEach(sagaMiddleware.run);
  return store;
}

export default create;