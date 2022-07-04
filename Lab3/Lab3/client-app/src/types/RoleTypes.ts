import { Role } from '../models/Role';

export type RoleState = {
    roles: Array<Role>;
    loading: boolean;
    loaded: boolean;
    error: Nullable<string>;
};

export enum RolesActionTypes {
    GET_ALL = 'GET_ALL_ROLES',
    GET_ALL_SUCCESS = 'GET_ALL_ROLES_SUCCESS',
    GET_ALL_ERROR = 'GET_ALL_ROLES_ERROR',

    ADD_ROLE = 'ADD_ROLE',
    ADD_ROLE_SUCCESS = 'ADD_ROLE_SUCCESS',
    ADD_ROLE_ERROR = 'ADD_ROLE_ERROR',
}

type GetRolesStartAction = {
    type: RolesActionTypes.GET_ALL;
};

type GetRolesSuccessAction = {
    type: RolesActionTypes.GET_ALL_SUCCESS;
    payload: Array<Role>;
};

type GetRolesErrorAction = {
    type: RolesActionTypes.GET_ALL_ERROR;
    payload: string;
};

type GetRolesAction = GetRolesStartAction | GetRolesSuccessAction | GetRolesErrorAction;

type ModifyRolesStartAction = {
    type: RolesActionTypes.ADD_ROLE;
};

type ModifyRolesSuccessAction = {
    type: RolesActionTypes.ADD_ROLE_SUCCESS;
    payload: Role;
};

type ModifyRolesErrorAction = {
    type: RolesActionTypes.ADD_ROLE_ERROR;
    payload: string;
};

type ModifyRolesAction =
    | ModifyRolesStartAction
    | ModifyRolesSuccessAction
    | ModifyRolesErrorAction;

export type RoleAction = GetRolesAction | ModifyRolesAction;
