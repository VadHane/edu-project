import React from 'react';
import { RouteNamesEnum } from '../types/Route.types';
import UserPage from '../pages/UsersPage';
import NotFoundPage from '../pages/NotFoundPage';
import { Navigate, RouteObject } from 'react-router-dom';
import ModelsPage from '../pages/ModelsPage';
import ModelsBrowserPage from '../pages/ModelsBrowserPage';
import ModelsViewerPage from '../pages/ModelsViewerPage';

export const defaultRouter: RouteObject = {
    path: '*',
    index: false,
    element: <NotFoundPage />,
};

export const pageNotFound: RouteObject = {
    path: RouteNamesEnum.PageNotFound,
    index: true,
    element: <NotFoundPage />,
};

export const userRouter: RouteObject = {
    path: RouteNamesEnum.Users,
    element: <UserPage />,
};

export const modelRouter: RouteObject = {
    path: RouteNamesEnum.Models,
    element: <ModelsPage />,
};

export const modelsBrowser: RouteObject = {
    path: RouteNamesEnum.ModelsBrowser,
    element: <ModelsBrowserPage />,
};

export const modelViewer: RouteObject = {
    path: RouteNamesEnum.ModelViewer,
    element: <ModelsViewerPage />,
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
