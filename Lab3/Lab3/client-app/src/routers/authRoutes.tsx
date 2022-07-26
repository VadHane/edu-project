import React from 'react';
import RegistrationModal from '../components/RegistrationModal';
import { IRoute } from '../models/IRoute';
import { RouteNamesEnum } from '../types/Route.types';
import LoginModal from './../components/LoginModal';

export const authRoutes: Array<IRoute> = [
    {
        path: RouteNamesEnum.Login,
        exact: true,
        element: <LoginModal />,
    },
    {
        path: RouteNamesEnum.Registration,
        exact: true,
        element: <RegistrationModal />,
    },
];
