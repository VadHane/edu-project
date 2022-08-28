import {
    userRouter,
    modelRouter,
    defaultRouter,
    authRoutesRedirect,
    modelsBrowser,
    pageNotFound,
    modelViewer,
} from './appRoutes';
import { authRoutes } from './authRoutes';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: Array<RouteObject> = [
    ...authRoutes,
    defaultRouter,
    pageNotFound,
];

export const userRoutes: Array<RouteObject> = [
    modelsBrowser,
    defaultRouter,
    pageNotFound,
    modelViewer,
    ...authRoutesRedirect,
];

export const adminRoutes: Array<RouteObject> = [userRouter, modelRouter, ...userRoutes];
