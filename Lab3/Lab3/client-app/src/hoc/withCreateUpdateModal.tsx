import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import UserCreateAndUpdateModalProps, {
    ResultActions,
} from '../components/UserCreateAndUpdateModal/UserCreateAndUpdateModal.types';
import {
    USER_WAS_ADDED_MESSAGE,
    USER_WAS_EDITED_MESSAGE,
} from '../components/UsersTable/UsersTable.constants';
import WarningModal from '../components/WarningModal';
import { INCORECT_USER_ID_EXCEPTION } from '../exceptions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useUserById } from '../hooks/useUserById';
import { RouteNamesEnum } from '../types/Route.types';

export function withCreateUpdateModal(
    Component: FunctionComponent<UserCreateAndUpdateModalProps>,
) {
    return (props: UserCreateAndUpdateModalProps) => {
        const { actionWasDone, error } = useTypedSelector((state) => state.user);
        const { id } = useParams();

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
                <WarningModal message={error || ''} navigateTo={RouteNamesEnum.Users} />
            );
        } else if (actionWasDone) {
            const message =
                props.resultActionType === ResultActions.Add
                    ? USER_WAS_ADDED_MESSAGE
                    : USER_WAS_EDITED_MESSAGE;

            return <WarningModal message={message} navigateTo={RouteNamesEnum.Users} />;
        }

        return <Component {...props} />;
    };
}
