import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

export default function({
  reducers,
  initialState,
  middlewares,
  extraEnhancers
}) {
  const composeEnhancers =
      process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, maxAge: 30 })
        : compose;
  // 使用数组方便之后添加其他extraEnhancers
  const enhancers = [applyMiddleware(...middlewares), ...extraEnhancers];
  return createStore(
    combineReducers(reducers), 
    initialState, 
    composeEnhancers(...enhancers)
  );
}