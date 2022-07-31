import React, { FunctionComponent, useEffect } from 'react';
import { RouteNamesEnum } from '../../types/Route.types';
import Preloader from '../../components/Preloader';
import UserTable from '../../components/UsersTable';
import WarningModal from '../../components/WarningModal';
import { useUserActions } from '../../hooks/useUserActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Outlet } from 'react-router-dom';

const UserPage: FunctionComponent = () => {
    const { loaded, loading, error } = useTypedSelector((state) => state.user);

    const { getAllUsers } = useUserActions();

    useEffect(() => {
        if (!loaded) {
            getAllUsers();
        }
    }, []);

    if (loading) {
        return <Preloader />;
    }

    if (error) {
        return <WarningModal message={error} navigateTo={RouteNamesEnum.StartPage} />;
    }

    return (
        <>
            <UserTable />
            <Outlet />
        </>
    );
};

export default UserPage;
