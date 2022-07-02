import WarningModal from '../components/WarningModal';
import { IRoute, RouteNamesEnum } from '../types';
import { userRoutes } from './userRoutes';
import { INCORRECT_PATH_EXCEPTION } from '../exceptions';

const defaultRouter: IRoute = {
    path: '*',
    exact: false,
    element: (
        <WarningModal
            message={INCORRECT_PATH_EXCEPTION}
            navigateTo={RouteNamesEnum.Users}
        />
    ),
};

export const routes: Array<IRoute> = [...userRoutes, defaultRouter];
