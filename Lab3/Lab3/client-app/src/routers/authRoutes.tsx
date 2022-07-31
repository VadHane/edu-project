import React from 'react';
import { RouteObject } from 'react-router-dom';
import RegistrationModal from '../components/RegistrationModal';
import { RouteNamesEnum } from '../types/Route.types';
import LoginModal from './../components/LoginModal';

export const authRoutes: Array<RouteObject> = [
    {
        path: RouteNamesEnum.Login,
        index: true,
        element: <LoginModal />,
    },
    {
        path: RouteNamesEnum.Registration,
        index: true,
        element: <RegistrationModal />,
    },
];
