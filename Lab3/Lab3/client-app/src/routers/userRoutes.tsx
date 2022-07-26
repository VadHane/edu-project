import React from 'react';
import { ModalResultActions } from './../types/App.types';

import {
    ADD_USER_BUTTON_TEXT,
    EDIT_USER_BUTTON_TEXT,
} from '../components/UsersTable/UsersTable.constants';
import { RouteNamesEnum } from '../types/Route.types';
import UserCreateAndUpdateModal from './../components/UserCreateAndUpdateModal';
import { RouteObject } from 'react-router-dom';

export const userRoutes: Array<RouteObject> = [
    {
        path: RouteNamesEnum.AddUser,
        index: true,
        element: (
            <UserCreateAndUpdateModal
                buttonContent={ADD_USER_BUTTON_TEXT}
                resultActionType={ModalResultActions.Add}
            />
        ),
    },
    {
        path: RouteNamesEnum.EditUserById,
        index: true,
        element: (
            <UserCreateAndUpdateModal
                buttonContent={EDIT_USER_BUTTON_TEXT}
                resultActionType={ModalResultActions.Edit}
            />
        ),
    },
];
