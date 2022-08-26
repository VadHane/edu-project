import { Dispatch } from 'redux';
import {
    ADDING_ROLE_EXCEPTION,
    LOADING_ROLES_EXCEPTION,
    UNAUTHORIZED_EXCEPTION,
} from '../../exceptions';
import { IStoreActionCallback } from '../../models/IStoreActionCallback';
import { Role } from '../../models/Role';
import { createNewRole, getAllRolesAsync } from '../../services/roleService';
import { Maybe } from '../../types/App.types';
import { RoleAction, RolesActionTypes } from '../../types/Role.types';
import { logout } from './authActions';

export const getAllRoles = (callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch<RoleAction>) => {
        try {
            const response = await getAllRolesAsync();

            dispatchEvent({ type: RolesActionTypes.GET_ALL_SUCCESS, payload: response });

            isDone = true;
        } catch {
            error = error || LOADING_ROLES_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const addNewRole = (role: Role, callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch<RoleAction>) => {
        try {
            const response = await createNewRole(role);

            dispatchEvent({ type: RolesActionTypes.ADD_ROLE_SUCCESS, payload: response });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || ADDING_ROLE_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};
