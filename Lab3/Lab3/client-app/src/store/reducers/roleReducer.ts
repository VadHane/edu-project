import { RoleAction, RolesActionTypes, RoleState } from '../../types/Role.types';

const initialState: RoleState = {
    roles: [],
};

export const roleReducer = (state = initialState, action: RoleAction): RoleState => {
    switch (action.type) {
        case RolesActionTypes.GET_ALL_SUCCESS:
            return {
                roles: [...action.payload],
            };
        case RolesActionTypes.ADD_ROLE_SUCCESS:
            return {
                roles: [...state.roles, action.payload],
            };
        default:
            return state;
    }
};
