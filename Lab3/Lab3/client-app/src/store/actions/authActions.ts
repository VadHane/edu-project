import { Dispatch } from 'redux';
import {
    AUTHORIZATION_EXCEPTION,
    LOGOUT_EXCEPTION,
    REGISTRATION_EXCEPTION,
} from '../../exceptions';
import { User } from '../../models/User';
import {
    authByAccessToken,
    authorizationUserAsync,
    registrationUserAsync,
} from '../../services/authService';
import { SessionStorageFields } from '../../types/App.types';
import { AuthActionTypes } from '../../types/Auth.types';

export const authorization = (email: string, password: string) => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: AuthActionTypes.AUTHORIZATION_START });

            const user = await authorizationUserAsync(email, password);

            dispatchEvent({ type: AuthActionTypes.AUTHORIZATION_SUCCESS, payload: user });
        } catch {
            dispatchEvent({
                type: AuthActionTypes.AUTHORIZATION_ERROR,
                payload: AUTHORIZATION_EXCEPTION,
            });
        }
    };
};

export const registration = (user: User, file: File) => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: AuthActionTypes.REGISTRATION_START });

            const regUser = await registrationUserAsync(user, file);

            dispatchEvent({
                type: AuthActionTypes.REGISTRATION_SUCCESS,
                payload: regUser,
            });
        } catch {
            dispatchEvent({
                type: AuthActionTypes.REGISTRATION_ERROR,
                payload: REGISTRATION_EXCEPTION,
            });
        }
    };
};

export const logout = () => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: AuthActionTypes.LOGOUT_START });

            sessionStorage.removeItem(SessionStorageFields.ACCESS_TOKEN);
            sessionStorage.removeItem(SessionStorageFields.REFRESH_TOKEN);

            dispatchEvent({ type: AuthActionTypes.LOGOUT_SUCCESS });
        } catch {
            dispatchEvent({
                type: AuthActionTypes.LOGOUT_ERROR,
                payload: LOGOUT_EXCEPTION,
            });
        }
    };
};

export const initialAuth = () => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: AuthActionTypes.AUTHORIZATION_START });

            const user = await authByAccessToken();

            dispatchEvent({ type: AuthActionTypes.AUTHORIZATION_SUCCESS, payload: user });
        } catch {
            logout()(dispatchEvent);
        }
    };
};
