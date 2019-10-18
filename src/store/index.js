import { applyMiddleware, compose, createStore } from 'redux';
import thunk                                     from 'redux-thunk';
import rootReducer                               from './reducers/index';

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, storeEnhancers(applyMiddleware(thunk)));

export default store;
