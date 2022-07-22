import React from 'react';
import { IRoute } from '../models/IRoute';
import { RouteNamesEnum } from '../types/Route.types';
import ModelCreateAndUpdateModal from './../components/ModelCreateAndUpdateModal';
import {
    ADD_MODEL_BUTTON_TEXT,
    EDIT_MODEL_BUTTON_TEXT,
} from '../components/ModelsTable/ModelsTable.constants';
import { ModalResultActions } from '../types/App.types';

export const modelRoutes: Array<IRoute> = [
    {
        path: RouteNamesEnum.Add,
        exact: true,
        element: (
            <ModelCreateAndUpdateModal
                buttonContent={ADD_MODEL_BUTTON_TEXT}
                resultActionType={ModalResultActions.Add}
            />
        ),
    },
    {
        path: RouteNamesEnum.EditById,
        exact: true,
        element: (
            <ModelCreateAndUpdateModal
                buttonContent={EDIT_MODEL_BUTTON_TEXT}
                resultActionType={ModalResultActions.Edit}
            />
        ),
    },
];
