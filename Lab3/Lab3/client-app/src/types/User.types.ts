import { User } from '../models/User';

export type UserState = {
    users: Array<User>;
};

export enum UserActionTypes {
    GET_ALL_SUCCESS = 'GET_ALL_SUCCES',

    ADD_USER_SUCCESS = 'ADD_USER_SUCCESS',

    EDIT_USER_SUCCESS = 'EDIT_USER_SUCCES',

    DELETE_USER_SUCCESS = 'DELETE_USER_SUCCES',
}

type GetUserSuccessAction = {
    type: UserActionTypes.GET_ALL_SUCCESS;
    payload: Array<User>;
};

type ModifyUserSuccessAction = {
    type:
        | UserActionTypes.ADD_USER_SUCCESS
        | UserActionTypes.EDIT_USER_SUCCESS
        | UserActionTypes.DELETE_USER_SUCCESS;
    payload: User;
};

export type UserActions = GetUserSuccessAction | ModifyUserSuccessAction;
