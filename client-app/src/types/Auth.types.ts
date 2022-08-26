import { User } from '../models/User';
import { Maybe } from '../types/App.types';

export type AuthState = {
    isAuth: boolean;
    user: Maybe<User>;

    isLoading: boolean;
    error: Nullable<string>;
};

export enum AuthActionTypes {
    AUTHORIZATION_START = 'AUTHORIZATION_START',
    AUTHORIZATION_SUCCESS = 'AUTHORIZATION_SUCCESS',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',

    REGISTRATION_START = 'REGISTRATION_START',
    REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS',
    REGISTRATION_ERROR = 'REGISTRATION_ERROR',

    LOGOUT_START = 'LOGOUT_START',
    LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
    LOGOUT_ERROR = 'LOGOUT_ERROR',
}

type AuthStartAction = {
    type: AuthActionTypes.AUTHORIZATION_START;
};

type AuthSuccessAction = {
    type: AuthActionTypes.AUTHORIZATION_SUCCESS;
    payload: User;
};

type AuthErrorAction = {
    type: AuthActionTypes.AUTHORIZATION_ERROR;
    payload: string;
};

type AuthActions = AuthStartAction | AuthSuccessAction | AuthErrorAction;

type RegStartAction = {
    type: AuthActionTypes.REGISTRATION_START;
};

type RegSuccessAction = {
    type: AuthActionTypes.REGISTRATION_SUCCESS;
    payload: User;
};

type RegErrorAction = {
    type: AuthActionTypes.REGISTRATION_ERROR;
    payload: string;
};

type RegActions = RegStartAction | RegSuccessAction | RegErrorAction;

type LogoutStartAction = {
    type: AuthActionTypes.LOGOUT_START;
};

type LogoutSuccessAction = {
    type: AuthActionTypes.LOGOUT_SUCCESS;
};

type LogoutErrorAction = {
    type: AuthActionTypes.LOGOUT_ERROR;
    payload: string;
};

type LogoutActions = LogoutStartAction | LogoutSuccessAction | LogoutErrorAction;

export type AuthorizationActions = AuthActions | RegActions | LogoutActions;

export enum FetchMethodsEnum {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export type FetchOptions = {
    method?: FetchMethodsEnum;
    body?: FormData;
};
