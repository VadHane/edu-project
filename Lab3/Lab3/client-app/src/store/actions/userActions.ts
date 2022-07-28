import { Dispatch } from 'redux';
import {
    ADDING_USER_EXCEPTION,
    DELETING_USER_EXCEPTION,
    EDITING_USER_EXCEPTION,
    LOADING_USERS_EXCEPTION,
    UNAUTHORIZED_EXCEPTION,
} from '../../exceptions';
import { User } from '../../models/User';
import {
    addUserAsync,
    deleteUserAsync,
    editUserAsync,
    getAllUsersAsync,
} from '../../services/userService';
import { UserActionTypes, UserActions } from '../../types/User.types';
import { logout } from './authActions';

export const getAllUsers = () => {
    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            dispatchEvent({ type: UserActionTypes.GET_ALL });

            const response = await getAllUsersAsync();

            dispatchEvent({ type: UserActionTypes.GET_ALL_SUCCESS, payload: response });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: UserActionTypes.GET_ALL_ERROR,
                payload: LOADING_USERS_EXCEPTION,
            });
        }
    };
};

export const AddNewUserAsync = (user: User, file: File) => {
    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            dispatchEvent({
                type: UserActionTypes.ADD_USER,
            });

            const response = await addUserAsync(user, file);

            dispatchEvent({
                type: UserActionTypes.ADD_USER_SUCCESS,
                payload: response,
            });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: UserActionTypes.ADD_USER_ERROR,
                payload: ADDING_USER_EXCEPTION,
            });
        }
    };
};

export const EditUserAsync = (user: User, file: File) => {
    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            dispatchEvent({
                type: UserActionTypes.EDIT_USER,
            });

            const response = await editUserAsync(user, file);

            dispatchEvent({
                type: UserActionTypes.EDIT_USER_SUCCESS,
                payload: response,
            });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: UserActionTypes.EDIT_USER_ERROR,
                payload: EDITING_USER_EXCEPTION,
            });
        }
    };
};

export const DeleteUserAsync = (user: User) => {
    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            dispatchEvent({
                type: UserActionTypes.DELETE_USER,
            });

            const response = await deleteUserAsync(user);

            dispatchEvent({
                type: UserActionTypes.DELETE_USER_SUCCESS,
                payload: response,
            });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: UserActionTypes.EDIT_USER_ERROR,
                payload: DELETING_USER_EXCEPTION,
            });
        }
    };
};

export const resetState = () => {
    return (dispatchEvent: Dispatch) => {
        dispatchEvent({ type: UserActionTypes.RESET_USER });
    };
};
