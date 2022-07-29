import { Dispatch } from 'redux';
import {
    ADDING_USER_EXCEPTION,
    DELETING_USER_EXCEPTION,
    EDITING_USER_EXCEPTION,
    LOADING_USERS_EXCEPTION,
    UNAUTHORIZED_EXCEPTION,
} from '../../exceptions';
import { IStoreActionCallback } from '../../models/IStoreActionCallback';
import { User } from '../../models/User';
import {
    addUserAsync,
    deleteUserAsync,
    editUserAsync,
    getAllUsersAsync,
} from '../../services/userService';
import { Maybe } from '../../types/App.types';
import { UserActionTypes, UserActions } from '../../types/User.types';
import { logout } from './authActions';

export const getAllUsers = (callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            const response = await getAllUsersAsync();

            dispatchEvent({ type: UserActionTypes.GET_ALL_SUCCESS, payload: response });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || LOADING_USERS_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const AddNewUserAsync = (
    user: User,
    file: File,
    callback?: IStoreActionCallback,
) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            const response = await addUserAsync(user, file);

            dispatchEvent({
                type: UserActionTypes.ADD_USER_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || ADDING_USER_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const EditUserAsync = (
    user: User,
    file: File,
    callback?: IStoreActionCallback,
) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            const response = await editUserAsync(user, file);

            dispatchEvent({
                type: UserActionTypes.EDIT_USER_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || EDITING_USER_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const DeleteUserAsync = (user: User, callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch<UserActions>) => {
        try {
            const response = await deleteUserAsync(user);

            dispatchEvent({
                type: UserActionTypes.DELETE_USER_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || DELETING_USER_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};
