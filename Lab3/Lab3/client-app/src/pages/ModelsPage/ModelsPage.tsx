import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteNamesEnum } from '../../types/Route.types';
import Preloader from '../../components/Preloader';
import WarningModal from '../../components/WarningModal';
import ModelsTable from '../../components/ModelsTable';
import ModelsModal from './../../components/ModelModal';
import { useModelActions } from '../../hooks/useModelActions';
import { Maybe } from '../../types/App.types';
import { Model } from '../../models/Model';
import { UNKNOWN_EXCEPTION } from '../../exceptions';

const ModelsPage: FunctionComponent = () => {
    const { getAllModels, addNewModel, editModel } = useModelActions();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Nullable<string>>(null);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<Maybe<Model>>(undefined);

    useEffect(() => {
        setIsLoading(true);

        getAllModels((isDone, error) => {
            setIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            }
        });
    }, []);

    const onAddModelHandler = () => setOpenModal(true);

    const onEditModelHandler = (model: Model) => {
        return () => {
            setOpenModal(true);
            setSelectedModel(model);
        };
    };

    const onCloseModalHandler = () => {
        setOpenModal(false);
        setSelectedModel(undefined);
    };

    if (isLoading) {
        return <Preloader />;
    }

    if (error) {
        return <WarningModal message={error} navigateTo={RouteNamesEnum.StartPage} />;
    }

    return (
        <>
            <ModelsTable
                onAddModelHandler={onAddModelHandler}
                onEditModelHandler={onEditModelHandler}
            />
            {!selectedModel ? (
                <ModelsModal
                    resultButtonsCaption="Add"
                    open={openModal}
                    model={selectedModel}
                    onCloseModalHandler={onCloseModalHandler}
                    onSendFormHandler={addNewModel}
                />
            ) : (
                <ModelsModal
                    resultButtonsCaption="Edit"
                    open={openModal}
                    model={selectedModel}
                    onCloseModalHandler={onCloseModalHandler}
                    onSendFormHandler={editModel}
                />
            )}
        </>
    );
};

export default ModelsPage;
