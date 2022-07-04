import { RoleAction, RolesActionTypes, RoleState } from '../../types/RoleTypes';

const initialState: RoleState = {
    roles: [],
    loading: false,
    loaded: false,
    error: null,
};

export const roleReducer = (state = initialState, action: RoleAction): RoleState => {
    switch (action.type) {
        case RolesActionTypes.GET_ALL:
            return {
                roles: [],
                loading: true,
                loaded: false,
                error: null,
            };
        case RolesActionTypes.GET_ALL_SUCCESS:
            return {
                roles: [...action.payload],
                loading: false,
                loaded: true,
                error: null,
            };
        case RolesActionTypes.GET_ALL_ERROR:
            return {
                roles: [],
                loading: false,
                loaded: false,
                error: action.payload,
            };
        case RolesActionTypes.ADD_ROLE:
            return {
                roles: state.roles,
                loading: true,
                loaded: true,
                error: null,
            };
        case RolesActionTypes.ADD_ROLE_SUCCESS:
            return {
                roles: [...state.roles, action.payload],
                loading: false,
                loaded: false,
                error: null,
            };
        case RolesActionTypes.ADD_ROLE_ERROR:
            return {
                roles: [...state.roles],
                loading: false,
                loaded: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
