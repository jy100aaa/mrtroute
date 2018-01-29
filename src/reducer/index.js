import { combineReducers } from 'redux';
import commonReducer from './commonReducer';

const appReducer = combineReducers({
    common: commonReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
