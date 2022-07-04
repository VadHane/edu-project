import React, { FunctionComponent } from 'react';
import Preloader from '../components/Preloader/Preloader';
import WarningModal from '../components/WarningModal';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { RouteNamesEnum } from '../types';

export function withLoading<T>(Component: FunctionComponent<T>) {
    return (props: T) => {
        const { loading, error } = useTypedSelector((state) => state.user);

        if (loading) {
            return <Preloader />;
        }

        if (error) {
            return <WarningModal message={error} navigateTo={RouteNamesEnum.Users} />;
        }

        return <Component {...props} />;
    };
}
