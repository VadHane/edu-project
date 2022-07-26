import { AuthState, AuthorizationActions, AuthActionTypes } from '../../types/Auth.types';

const initialState: AuthState = {
    isAuth: false,
    user: undefined,
    isLoading: false,
    error: null,
};

export const authReducer = (
    state = initialState,
    action: AuthorizationActions,
): AuthState => {
    switch (action.type) {
        case AuthActionTypes.AUTHORIZATION_START:
            return {
                ...initialState,
                isLoading: true,
            };
        case AuthActionTypes.AUTHORIZATION_SUCCESS:
            return {
                ...initialState,
                isAuth: true,
                user: action.payload,
            };
        case AuthActionTypes.AUTHORIZATION_ERROR:
            return {
                ...initialState,
                isLoading: false,
                error: action.payload,
            };
        case AuthActionTypes.REGISTRATION_START:
            return {
                ...initialState,
                isLoading: true,
            };
        case AuthActionTypes.REGISTRATION_SUCCESS:
            return {
                ...initialState,
                isAuth: true,
                user: action.payload,
            };
        case AuthActionTypes.REGISTRATION_ERROR:
            return {
                ...initialState,
                isLoading: false,
                error: action.payload,
            };
        case AuthActionTypes.LOGOUT_START:
            return {
                ...initialState,
                isLoading: true,
            };
        case AuthActionTypes.LOGOUT_SUCCESS:
            return {
                ...initialState,
            };
        case AuthActionTypes.LOGOUT_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};
