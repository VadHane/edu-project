import React, { FunctionComponent, useEffect, useState } from 'react';
import ModelsBrowser from '../../components/ModelsBrowser/ModelsBrowser';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useModelActions } from '../../hooks/useModelActions';
import { UNKNOWN_EXCEPTION } from '../../exceptions';
import { Snackbar, Alert } from '@mui/material';

const ModelsBrowserPage: FunctionComponent = () => {
    const { models } = useTypedSelector((state) => state.model);
    const { getAllModels } = useModelActions();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        setIsLoading(true);

        getAllModels((isDone, error) => {
            setIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            }
        });
    }, []);

    const onCloseSnackbarHandler = () => {
        setError(undefined);
    };

    return (
        <>
            <ModelsBrowser models={models} isLoading={isLoading} />
            <Snackbar
                open={error !== undefined}
                autoHideDuration={6000}
                onClose={onCloseSnackbarHandler}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </>
    );
};

export default ModelsBrowserPage;
