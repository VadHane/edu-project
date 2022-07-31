import React, { FunctionComponent, useEffect } from 'react';
import { RouteNamesEnum } from '../../types/Route.types';
import Preloader from '../../components/Preloader';
import WarningModal from '../../components/WarningModal';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Outlet } from 'react-router-dom';
import ModelsTable from '../../components/ModelsTable';
import { useModelActions } from '../../hooks/useModelActions';

const ModelsPage: FunctionComponent = () => {
    const { loading, error } = useTypedSelector((state) => state.model);
    const { getAllModels } = useModelActions();

    useEffect(() => {
        getAllModels();
    }, []);

    if (loading) {
        return <Preloader />;
    }

    if (error) {
        return <WarningModal message={error} navigateTo={RouteNamesEnum.StartPage} />;
    }

    return (
        <>
            <ModelsTable />
            <Outlet />
        </>
    );
};

export default ModelsPage;
