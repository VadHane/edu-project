import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { modelReducer } from './modelReducer';
import { roleReducer } from './roleReducer';
import { tagReduser } from './tagReducer';
import { userReduser } from './userReducer';

export const rootReducer = combineReducers({
    user: userReduser,
    role: roleReducer,
    model: modelReducer,
    tags: tagReduser,
    auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
