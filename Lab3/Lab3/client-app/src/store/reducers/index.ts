import { combineReducers } from 'redux';
import { modelReducer } from './modelReducer';
import { roleReducer } from './roleReducer';
import { userReduser } from './userReducer';

export const rootReducer = combineReducers({
    user: userReduser,
    role: roleReducer,
    model: modelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
