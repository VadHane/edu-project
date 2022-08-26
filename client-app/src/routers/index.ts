import {
    userRouter,
    modelRouter,
    defaultRouter,
    authRoutesRedirect,
    modelsBrowser,
} from './appRoutes';
import { authRoutes } from './authRoutes';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: Array<RouteObject> = [...authRoutes, defaultRouter];

export const userRoutes: Array<RouteObject> = [
    modelsBrowser,
    defaultRouter,
    ...authRoutesRedirect,
];

export const adminRoutes: Array<RouteObject> = [userRouter, modelRouter, ...userRoutes];
