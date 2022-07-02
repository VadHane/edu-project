import { combineReducers } from 'redux';
import { roleReducer } from './roleReducer';
import { userReduser } from './userReducer';

export const rootReducer = combineReducers({
    user: userReduser,
    role: roleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
