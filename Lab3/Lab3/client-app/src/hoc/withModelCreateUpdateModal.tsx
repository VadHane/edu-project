/* eslint-disable react/display-name */
import React, { FunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ModelCreateAndUpdateModalProps } from './../components/ModelCreateAndUpdateModal/ModelCreateAndUpdateModal.types';
import { useTypedSelector } from './../hooks/useTypedSelector';
import { useModelById } from './../hooks/useModelById';
import WarningModal from './../components/WarningModal';
import { INCORECT_MODEL_ID_EXCEPTION } from './../exceptions';
import { RouteNamesEnum } from '../types/Route.types';
import { ModalResultActions } from '../types/App.types';
import {
    MODEL_WAS_ADDED_MESSAGE,
    MODEL_WAS_EDITED_MESSAGE,
} from './../components/ModelCreateAndUpdateModal/ModelCreateAndUpdateModal.constants';
import { useModelActions } from '../hooks/useModelActions';

export const withModalCreateUpdateModal = (
    Component: FunctionComponent<ModelCreateAndUpdateModalProps>,
) => {
    return (props: ModelCreateAndUpdateModalProps) => {
        const { actionWasDone, error } = useTypedSelector((state) => state.model);
        const { resetState } = useModelActions();
        const { id } = useParams();
        const navigate = useNavigate();

        try {
            useModelById(id);
        } catch {
            return (
                <WarningModal
                    message={INCORECT_MODEL_ID_EXCEPTION}
                    navigateTo={RouteNamesEnum.Models}
                />
            );
        }

        if (actionWasDone === false) {
            return (
                <WarningModal
                    message={error || ''}
                    navigateTo={RouteNamesEnum.Models}
                    onClick={() => {
                        resetState();
                        navigate(RouteNamesEnum.Models);
                    }}
                />
            );
        } else if (actionWasDone) {
            const message =
                props.resultActionType === ModalResultActions.Add
                    ? MODEL_WAS_ADDED_MESSAGE
                    : MODEL_WAS_EDITED_MESSAGE;
            return (
                <WarningModal
                    message={message}
                    navigateTo={RouteNamesEnum.Models}
                    onClick={() => {
                        resetState();
                        navigate(RouteNamesEnum.Models);
                    }}
                />
            );
        }

        return <Component {...props} />;
    };
};
