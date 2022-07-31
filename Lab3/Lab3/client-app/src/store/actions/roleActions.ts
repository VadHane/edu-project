import { Dispatch } from 'redux';
import {
    ADDING_ROLE_EXCEPTION,
    LOADING_ROLES_EXCEPTION,
    UNAUTHORIZED_EXCEPTION,
} from '../../exceptions';
import { Role } from '../../models/Role';
import { createNewRole, getAllRolesAsync } from '../../services/roleService';
import { RoleAction, RolesActionTypes } from '../../types/Role.types';
import { logout } from './authActions';

export const getAllRoles = () => {
    return async (dispatchEvent: Dispatch<RoleAction>) => {
        try {
            dispatchEvent({ type: RolesActionTypes.GET_ALL });

            const response = await getAllRolesAsync();

            dispatchEvent({ type: RolesActionTypes.GET_ALL_SUCCESS, payload: response });
        } catch {
            dispatchEvent({
                type: RolesActionTypes.GET_ALL_ERROR,
                payload: LOADING_ROLES_EXCEPTION,
            });
        }
    };
};

export const addNewRole = (role: Role) => {
    return async (dispatchEvent: Dispatch<RoleAction>) => {
        try {
            dispatchEvent({ type: RolesActionTypes.ADD_ROLE });

            const response = await createNewRole(role);

            dispatchEvent({ type: RolesActionTypes.ADD_ROLE_SUCCESS, payload: response });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: RolesActionTypes.ADD_ROLE_ERROR,
                payload: ADDING_ROLE_EXCEPTION,
            });
        }
    };
};
