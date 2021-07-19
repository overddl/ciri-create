import * as sagaEffects from 'redux-saga/effects';

export default function(effects, model) {
  return function* () {
    // modelSaga 封装了一层cancel 
    if(typeof effects.main === 'function') {
      // 传递参数 effects 方便在 modelSaga中调用其他saga
      try {
        const task = yield sagaEffects.fork([effects, effects.main]);
        yield sagaEffects.fork(cancelSaga, model, task)
      }catch (err) {
        throw new Error(err);
      }
    }else {
      throw new Error(`${model.namespace}'s effects don't has modelSaga or modelSaga expect function.`)
    }
  }
}

// 取消saga执行
function* cancelSaga(model, task) {
  yield sagaEffects.take(`${model.namespace}/@@CANCEL_EFFECTS`);
  yield sagaEffects.cancel(task);
}