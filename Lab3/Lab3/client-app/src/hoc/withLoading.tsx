import React, { FunctionComponent } from 'react';
import Preloader from '../components/Preloader/Preloader';
import { useTypedSelector } from '../hooks/useTypedSelector';

export function withLoading<T>(Component: FunctionComponent<T>) {
    return (props: T) => {
        const { loading } = useTypedSelector((state) => state.user);

        if (loading) {
            return <Preloader />;
        }

        return <Component {...props} />;
    };
}
