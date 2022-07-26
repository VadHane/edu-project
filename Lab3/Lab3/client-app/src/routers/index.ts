import { userRouter, modelRouter, defaultRouter } from './appRoutes';
import { IRoute } from '../models/IRoute';
import { authRoutes } from './authRoutes';

export const publicRoutes: Array<IRoute> = [...authRoutes, defaultRouter];

export const userRoutes: Array<IRoute> = [modelRouter, defaultRouter];

export const adminRoutes: Array<IRoute> = [userRouter, ...userRoutes];
