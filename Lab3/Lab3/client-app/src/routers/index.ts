import { userRouter, modelRouter, defaultRouter, authRoutesRedirect } from './appRoutes';
import { authRoutes } from './authRoutes';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: Array<RouteObject> = [...authRoutes, defaultRouter];

export const userRoutes: Array<RouteObject> = [
    modelRouter,
    defaultRouter,
    ...authRoutesRedirect,
];

export const adminRoutes: Array<RouteObject> = [userRouter, ...userRoutes];
