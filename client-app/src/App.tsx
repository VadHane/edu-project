import React, { FunctionComponent, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import Header from './components/Header/Header';
import { useAuthActions } from './hooks/useAuthActions';
import { useTypedSelector } from './hooks/useTypedSelector';
import MainPage from './pages/MainPage';
import { adminRoutes, publicRoutes, userRoutes } from './routers';
import { RouteNamesEnum } from './types/Route.types';

const App: FunctionComponent = () => {
    const { initialAuth } = useAuthActions();
    const { user, isAuth } = useTypedSelector((state) => state.auth);

    useEffect(() => {
        initialAuth();
    }, []);

    const routes = isAuth ? (user?.isAdmin ? adminRoutes : userRoutes) : publicRoutes;

    const endpoints = useRoutes([
        {
            path: RouteNamesEnum.StartPage,
            element: <Header />,
            children: [
                {
                    index: true,
                    element: <MainPage />,
                },
                ...routes,
            ],
        },
    ]);

    return endpoints;
};

export default App;
