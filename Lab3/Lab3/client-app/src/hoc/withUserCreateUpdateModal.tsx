/* eslint-disable react/display-name */
import React, { FunctionComponent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserCreateAndUpdateModalProps from '../components/UserCreateAndUpdateModal/UserCreateAndUpdateModal.types';
import {
    USER_WAS_ADDED_MESSAGE,
    USER_WAS_EDITED_MESSAGE,
} from '../components/UsersTable/UsersTable.constants';
import WarningModal from '../components/WarningModal';
import { INCORECT_USER_ID_EXCEPTION } from '../exceptions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useUserActions } from '../hooks/useUserActions';
import { useUserById } from '../hooks/useUserById';
import { ModalResultActions } from '../types/App.types';
import { RouteNamesEnum } from '../types/Route.types';

export function withUserCreateUpdateModal(
    Component: FunctionComponent<UserCreateAndUpdateModalProps>,
) {
    return (props: UserCreateAndUpdateModalProps) => {
        const { actionWasDone, error } = useTypedSelector((state) => state.user);
        const { resetState } = useUserActions();
        const { id } = useParams();
        const navigate = useNavigate();

        try {
            useUserById(id);
        } catch {
            return (
                <WarningModal
                    message={INCORECT_USER_ID_EXCEPTION}
                    navigateTo={RouteNamesEnum.Users}
                />
            );
        }

        if (actionWasDone === false) {
            return (
                <WarningModal
                    message={error || ''}
                    navigateTo={RouteNamesEnum.Users}
                    onClick={() => {
                        resetState();
                        navigate(RouteNamesEnum.Users);
                    }}
                />
            );
        } else if (actionWasDone) {
            const message =
                props.resultActionType === ModalResultActions.Add
                    ? USER_WAS_ADDED_MESSAGE
                    : USER_WAS_EDITED_MESSAGE;

            return (
                <WarningModal
                    message={message}
                    navigateTo={RouteNamesEnum.Users}
                    onClick={() => {
                        resetState();
                        navigate(RouteNamesEnum.Users);
                    }}
                />
            );
        }

        return <Component {...props} />;
    };
}
