import { UserState, UserActions, UserActionTypes } from '../../types/User.types';

const initialState: UserState = {
    users: [],
    loading: false,
    loaded: false,
    error: null,
    actionWasDone: null,
};

export const userReduser = (state = initialState, action: UserActions): UserState => {
    switch (action.type) {
        case UserActionTypes.GET_ALL:
            return {
                loading: true,
                loaded: false,
                error: null,
                users: [],
                actionWasDone: null,
            };
        case UserActionTypes.GET_ALL_SUCCESS:
            return {
                loading: false,
                loaded: true,
                error: null,
                users: [...action.payload],
                actionWasDone: null,
            };
        case UserActionTypes.GET_ALL_ERROR:
            return {
                loading: false,
                loaded: false,
                error: action.payload,
                users: [],
                actionWasDone: null,
            };
        case UserActionTypes.ADD_USER:
            return {
                users: state.users,
                loaded: true,
                loading: true,
                error: null,
                actionWasDone: null,
            };
        case UserActionTypes.ADD_USER_SUCCESS:
            return {
                loading: false,
                loaded: false,
                error: null,
                users: [...state.users, action.payload],
                actionWasDone: true,
            };
        case UserActionTypes.ADD_USER_ERROR:
            return {
                loading: false,
                loaded: false,
                error: action.payload,
                users: state.users,
                actionWasDone: false,
            };
        case UserActionTypes.EDIT_USER:
            return {
                users: state.users,
                loaded: true,
                loading: true,
                error: null,
                actionWasDone: null,
            };
        case UserActionTypes.EDIT_USER_SUCCESS:
            return {
                loading: false,
                loaded: false,
                error: null,
                actionWasDone: true,
                users: [
                    ...state.users.filter((user) => user.id !== action.payload.id),
                    action.payload,
                ],
            };
        case UserActionTypes.EDIT_USER_ERROR:
            return {
                loading: false,
                loaded: false,
                error: action.payload,
                users: state.users,
                actionWasDone: false,
            };
        case UserActionTypes.DELETE_USER:
            return {
                loading: true,
                loaded: true,
                error: null,
                users: state.users,
                actionWasDone: null,
            };
        case UserActionTypes.DELETE_USER_SUCCESS:
            return {
                loading: false,
                loaded: false,
                error: null,
                actionWasDone: false,
                users: state.users.filter((user) => user.id !== action.payload.id),
            };
        case UserActionTypes.DELETE_USER_ERROR:
            return {
                loading: false,
                loaded: false,
                error: action.payload,
                users: state.users,
                actionWasDone: false,
            };
        default:
            return state;
    }
};