import { combineReducers } from 'redux';
import globalReducer       from './globalReducer';
import genReducer          from './genReducer';
import temReducer          from './temReducer';
import cont_reducer        from './contReducer';
import specReducer         from './specReducer';
import subReducer          from './subReducer';

export default combineReducers({
  global_data: globalReducer,
  gen_data: genReducer,
  tem_data: temReducer,
  cont_data: cont_reducer,
  spec_data: specReducer,
  sub_data: subReducer,
});
