import React from 'react';
import WarningModal from '../components/WarningModal';
import { RouteNamesEnum } from '../types/Route.types';
import { userRoutes } from './userRoutes';
import { INCORRECT_PATH_EXCEPTION } from '../exceptions';
import { IRoute } from '../models/IRoute';
import { modelRoutes } from './modelRoutes';

const defaultRouter: IRoute = {
    path: '*',
    exact: false,
    element: (
        <WarningModal
            message={INCORRECT_PATH_EXCEPTION}
            navigateTo={RouteNamesEnum.Users}
        />
    ),
};

export const routes: Array<IRoute> = [...userRoutes, ...modelRoutes, defaultRouter];
