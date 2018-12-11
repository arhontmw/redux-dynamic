/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'

const emptyMiddleware = () => next => action => next(action)
const emptyReducer = (state = {}) => state

const createAttach = (registry, store, dynamicMiddlewares) => ({
  key,
  initial = {},
  thunk = {},
  reducer = emptyReducer,
  middleware = emptyMiddleware,
}) => {
  if (!key) {
    console.error('Key is not defined.')
    return false
  }

  if (registry.keys[key]) {
    console.error('Store already has a same key.')
    return false
  }

  registry.keys = {
    ...registry.keys,
    [key]: true,
  }

  registry.reducers = {
    ...registry.reducers,
    [key]: (state = initial, action) => reducer(state, action),
  }

  registry.thunks = {
    ...registry.thunks,
    [key]: thunk,
  }

  registry.middlewares = {
    ...registry.middlewares,
    [key]: middleware,
  }

  store.replaceReducer(combineReducers(registry.reducers))
  dynamicMiddlewares.resetMiddlewares()

  const thunkObject = thunkMiddleware.withExtraArgument(registry.thunks)
  dynamicMiddlewares.addMiddleware(thunkObject)

  Object.values(registry.middlewares)
    .forEach((mdware) => {
      dynamicMiddlewares.addMiddleware(mdware)
    })

  return true
}

export {
  createAttach,
}
