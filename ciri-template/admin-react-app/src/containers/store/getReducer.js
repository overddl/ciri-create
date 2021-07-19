/**
 * getAllReducers
 * @param {Object} handlers { "action": handler }
 * @param {Object} defaultState 
 * @param {Object} model
 * @returns reducers
 */
function handleActions(handlers, defaultState, model) {
  // 返回 case 判断的函数，actionType === action.type
  function _handleAction(actionType, reducer = (val) => val) {
    // real reduce
    return function(state, action) {
      const { type } = action;
      if(actionType === type) {
        return reducer(state, action);
      }
      return state;
    }
  }
  // combineRedcers 组合 reducers
  function _reduceReducers(...reducers) {
    return (state, action) => {
      const modelReducer = reducers.reduce((prev, curr) => {
        const _reducers = curr(prev, action);
        return _reducers;
      }, state);
      return modelReducer
    }
  }
  const reducers = Object.keys(handlers).map(type => 
    _handleAction(`${model.namespace}/${type}`, handlers[type])
  );
  const reduce = _reduceReducers(...reducers);
  return (state = defaultState, action) => reduce(state, action)
}

/**
 * 获取 model 对应的reducer
 * @param {Array | Object} reducers model具有的reducers 支持enhance
 * @param {Object} state model默认state
 * @returns Function reducer
 */
export default function getReducer(reducers, state, model) {
  // reducers 为数组时，[reducers, enhanceReducers]
  if(Array.isArray(reducers)) {
    const enhancers = reducers[1];
    const _reducers = reducers[0];
    return enhancers(handleActions(_reducers, state, model))
  }else {
    return handleActions(reducers || {}, state, model);
  }
}