import { IRoute } from '../models/IRoute';
import { RouteNamesEnum } from '../types/Route.types';
import ModelsTable from './../components/ModelsTable';

export const modelRoutes: Array<IRoute> = [
    {
        path: RouteNamesEnum.Models,
        exact: true,
        element: <ModelsTable />,
    },
];
