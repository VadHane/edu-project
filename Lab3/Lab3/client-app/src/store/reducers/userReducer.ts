import { UserState, UserActions, UserActionTypes } from '../../types/User.types';

const initialState: UserState = {
    users: [],
};

export const userReduser = (state = initialState, action: UserActions): UserState => {
    switch (action.type) {
        case UserActionTypes.GET_ALL_SUCCESS:
            return {
                users: [...action.payload],
            };
        case UserActionTypes.ADD_USER_SUCCESS:
            return {
                users: [...state.users, action.payload],
            };
        case UserActionTypes.EDIT_USER_SUCCESS:
            return {
                users: [
                    ...state.users.filter((user) => user.id !== action.payload.id),
                    action.payload,
                ],
            };
        case UserActionTypes.DELETE_USER_SUCCESS:
            return {
                users: state.users.filter((user) => user.id !== action.payload.id),
            };
        default:
            return state;
    }
};
