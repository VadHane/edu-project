import React from 'react';
import { IRoute } from '../models/IRoute';
import { RouteNamesEnum } from '../types/Route.types';
import ModelsTable from './../components/ModelsTable';
import ModelCreateAndUpdateModal from './../components/ModelCreateAndUpdateModal';
import { ADD_MODEL_BUTTON_TEXT } from '../components/ModelsTable/ModelsTable.constants';
import { ModalResultActions } from '../types/App.types';

export const modelRoutes: Array<IRoute> = [
    {
        path: RouteNamesEnum.Models,
        exact: true,
        element: <ModelsTable />,
    },
    {
        path: RouteNamesEnum.AddModel,
        exact: true,
        element: (
            <ModelCreateAndUpdateModal
                buttonContent={ADD_MODEL_BUTTON_TEXT}
                resultActionType={ModalResultActions.Add}
            />
        ),
    },
];
