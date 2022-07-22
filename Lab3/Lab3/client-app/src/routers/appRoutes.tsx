import React from 'react';
import { IRoute } from '../models/IRoute';
import { RouteNamesEnum } from '../types/Route.types';
import UsersTable from '../components/UsersTable';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import ModelsTable from './../components/ModelsTable';

export const defaultRouter: IRoute = {
    path: '*',
    exact: false,
    element: <NotFoundPage />,
};

export const userRouter: IRoute = {
    path: RouteNamesEnum.Users,
    exact: true,
    element: <UsersTable />,
};

export const modelRouter: IRoute = {
    path: RouteNamesEnum.Models,
    exact: true,
    element: <ModelsTable />,
};
