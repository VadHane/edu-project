import { User } from '../models/User';

export type UserState = {
    users: Array<User>;
    loading: boolean;
    loaded: boolean;
    error: Nullable<string>;
    actionWasDone: Nullable<boolean>;
};

export enum UserActionTypes {
    GET_ALL = 'GET_ALL',
    GET_ALL_SUCCESS = 'GET_ALL_SUCCES',
    GET_ALL_ERROR = 'GET_ALL_ERROR',

    ADD_USER = 'ADD_USER',
    ADD_USER_SUCCESS = 'ADD_USER_SUCCESS',
    ADD_USER_ERROR = 'ADD_USER_ERROR',

    EDIT_USER = 'EDIT_USER',
    EDIT_USER_SUCCESS = 'EDIT_USER_SUCCES',
    EDIT_USER_ERROR = 'EDIT_USER_ERROR',

    DELETE_USER = 'DELETE_USER',
    DELETE_USER_SUCCESS = 'DELETE_USER_SUCCES',
    DELETE_USER_ERROR = 'DELETE_USER_ERROR',

    RESET_USER = 'RESET_USER',
}

type GetUserStartAction = {
    type: UserActionTypes.GET_ALL;
};

type GetUserSuccessAction = {
    type: UserActionTypes.GET_ALL_SUCCESS;
    payload: Array<User>;
};

type GetUserErrorAction = {
    type: UserActionTypes.GET_ALL_ERROR;
    payload: string;
};

type GetUserActions = GetUserStartAction | GetUserSuccessAction | GetUserErrorAction;

type ModifyUserStartAction = {
    type:
        | UserActionTypes.ADD_USER
        | UserActionTypes.EDIT_USER
        | UserActionTypes.DELETE_USER;
};

type ModifyUserSuccessAction = {
    type:
        | UserActionTypes.ADD_USER_SUCCESS
        | UserActionTypes.EDIT_USER_SUCCESS
        | UserActionTypes.DELETE_USER_SUCCESS;
    payload: User;
};

type ModifyUserErrorAction = {
    type:
        | UserActionTypes.ADD_USER_ERROR
        | UserActionTypes.EDIT_USER_ERROR
        | UserActionTypes.DELETE_USER_ERROR;
    payload: string;
};

type ModifyUserActions =
    | ModifyUserStartAction
    | ModifyUserSuccessAction
    | ModifyUserErrorAction;

type ResetUser = {
    type: UserActionTypes.RESET_USER;
};

export type UserActions = GetUserActions | ModifyUserActions | ResetUser;
