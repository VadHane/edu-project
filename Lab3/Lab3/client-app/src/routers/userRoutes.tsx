import React from 'react';
import { ModalResultActions } from './../types/App.types';

import {
    ADD_USER_BUTTON_TEXT,
    EDIT_USER_BUTTON_TEXT,
} from '../components/UsersTable/UsersTable.constants';
import { IRoute } from '../models/IRoute';
import { RouteNamesEnum } from '../types/Route.types';
import UserCreateAndUpdateModal from './../components/UserCreateAndUpdateModal';

export const userRoutes: Array<IRoute> = [
    {
        path: RouteNamesEnum.Add,
        exact: true,
        element: (
            <UserCreateAndUpdateModal
                buttonContent={ADD_USER_BUTTON_TEXT}
                resultActionType={ModalResultActions.Add}
            />
        ),
    },
    {
        path: RouteNamesEnum.EditById,
        exact: true,
        element: (
            <UserCreateAndUpdateModal
                buttonContent={EDIT_USER_BUTTON_TEXT}
                resultActionType={ModalResultActions.Edit}
            />
        ),
    },
];
