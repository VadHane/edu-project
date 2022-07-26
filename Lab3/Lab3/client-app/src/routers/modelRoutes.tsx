import React from 'react';
import { RouteNamesEnum } from '../types/Route.types';
import ModelCreateAndUpdateModal from './../components/ModelCreateAndUpdateModal';
import {
    ADD_MODEL_BUTTON_TEXT,
    EDIT_MODEL_BUTTON_TEXT,
} from '../components/ModelsTable/ModelsTable.constants';
import { ModalResultActions } from '../types/App.types';
import { RouteObject } from 'react-router-dom';

export const modelRoutes: Array<RouteObject> = [
    {
        path: RouteNamesEnum.AddModel,
        index: true,
        element: (
            <ModelCreateAndUpdateModal
                buttonContent={ADD_MODEL_BUTTON_TEXT}
                resultActionType={ModalResultActions.Add}
            />
        ),
    },
    {
        path: RouteNamesEnum.EditModelById,
        index: true,
        element: (
            <ModelCreateAndUpdateModal
                buttonContent={EDIT_MODEL_BUTTON_TEXT}
                resultActionType={ModalResultActions.Edit}
            />
        ),
    },
];
