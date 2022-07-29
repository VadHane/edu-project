import { Role } from '../models/Role';

export type RoleState = {
    roles: Array<Role>;
};

export enum RolesActionTypes {
    GET_ALL_SUCCESS = 'GET_ALL_ROLES_SUCCESS',

    ADD_ROLE_SUCCESS = 'ADD_ROLE_SUCCESS',
}

type GetRolesSuccessAction = {
    type: RolesActionTypes.GET_ALL_SUCCESS;
    payload: Array<Role>;
};

type ModifyRolesSuccessAction = {
    type: RolesActionTypes.ADD_ROLE_SUCCESS;
    payload: Role;
};

export type RoleAction = GetRolesSuccessAction | ModifyRolesSuccessAction;
