import React from 'react';
import { RouteNamesEnum } from '../types/Route.types';
import UserPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';
import { userRoutes } from './userRoutes';
import { modelRoutes } from './modelRoutes';
import { Navigate, RouteObject } from 'react-router-dom';
import ModelsPage from '../pages/ModelsPage';

export const defaultRouter: RouteObject = {
    path: '*',
    index: false,
    element: <NotFoundPage />,
};

export const userRouter: RouteObject = {
    path: RouteNamesEnum.Users,
    element: <UserPage />,
    children: [...userRoutes],
};

export const modelRouter: RouteObject = {
    path: RouteNamesEnum.Models,
    element: <ModelsPage />,
    children: [...modelRoutes],
};

export const authRoutesRedirect: Array<RouteObject> = [
    {
        path: RouteNamesEnum.Login,
        index: true,
        element: <Navigate to={RouteNamesEnum.StartPage} replace />,
    },
    {
        path: RouteNamesEnum.Registration,
        index: true,
        element: <Navigate to={RouteNamesEnum.StartPage} replace />,
    },
];
