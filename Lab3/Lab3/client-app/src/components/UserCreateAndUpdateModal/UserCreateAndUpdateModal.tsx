import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Role } from '../../models/Role';
import AddedRolesList from './AddedRolesList';
import AvailableRolesList from './AvailableRolesList';
import UserCreateAndUpdateModalProps from './UserCreateAndUpdateModal.types';
import { User } from '../../models/User';
import {
    FILE_NOT_IMAGE_EXCEPTION,
    INCORRECT_EMAIL_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
    LENGTH_OF_PASSWORD_EXCEPTION,
    LENGTH_OF_SURNAME_EXCEPTION,
} from '../../exceptions';
import './UserCreateAndUpdateModal.css';
import {
    EMAIL_PLACEHOLDER,
    emptyUser,
    FIRST_NAME_PLACEHOLDER,
    LAST_NAME_PLACEHOLDER,
    PASSWORD_PLACEHOLDER,
} from './UserCreateAndUpdateModal.constants';
import { useUserById } from '../../hooks/useUserById';
import { useRoleActions } from './../../hooks/useRoleActions';
import { useUserActions } from '../../hooks/useUserActions';
import { RouteNamesEnum } from '../../types/Route.types';
import { withUserCreateUpdateModal } from './../../hoc/withUserCreateUpdateModal';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import Preloader from '../Preloader';
import WarningModal from '../WarningModal';
import { ModalResultActions } from '../../types/App.types';

const UserCreateAndUpdateModal: FunctionComponent<UserCreateAndUpdateModalProps> = ({
    resultActionType,
    buttonContent,
}) => {
    const { id } = useParams();

    const foundUser = useUserById(id) || emptyUser;

    const [firstName, setFirstName] = useState<string>(foundUser.firstName);
    const [lastName, setLastName] = useState<string>(foundUser.lastName);
    const [email, setEmail] = useState<string>(foundUser.email);
    const [password, setPassword] = useState<string>(foundUser.password);

    const [addedRoles, setAddedRoles] = useState<Array<Role>>([...foundUser.roles]);

    const [exceptionMessage, setExceptionMessage] = useState<string>('');

    const file = React.createRef<HTMLInputElement>();

    const { AddNewUserAsync, EditUserAsync } = useUserActions();
    const { loading, error } = useTypedSelector((state) => state.role);
    const { getAllRoles } = useRoleActions();

    useEffect(() => {
        getAllRoles();
    }, []);

    useEffect(() => {
        setExceptionMessage('');
    }, [firstName, lastName, email]);

    if (loading) {
        return <Preloader />;
    }

    if (error) {
        return <WarningModal message={error} navigateTo={RouteNamesEnum.Users} />;
    }

    const backgroundNode: React.ReactNode = (
        <NavLink to={RouteNamesEnum.Users} title="Close modal window">
            <div className="background"></div>
        </NavLink>
    );

    const exceptionString: React.ReactNode = (
        <div className="exception-message">
            <span>{exceptionMessage}</span>
        </div>
    );

    const modalWindowNode: React.ReactNode = (
        <div className="window">
            <form>
                <div className="formRows">
                    <br />
                    {exceptionString}
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder={FIRST_NAME_PLACEHOLDER}
                        value={firstName}
                        onChange={(event) => {
                            setFirstName(event.target.value);
                        }}
                    />
                    <br />

                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder={LAST_NAME_PLACEHOLDER}
                        value={lastName}
                        onChange={(event) => {
                            setLastName(event.target.value);
                        }}
                    />
                    <br />

                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={EMAIL_PLACEHOLDER}
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <br />

                    <input
                        type="text"
                        name="password"
                        id="password"
                        placeholder={PASSWORD_PLACEHOLDER}
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <br />

                    <AddedRolesList
                        addedRoles={addedRoles}
                        removeAddedRole={(role: Role) => addAvailableRole(role)}
                    />

                    <AvailableRolesList
                        addedRoles={addedRoles}
                        addRole={(role: Role) => addRole(role)}
                    />

                    <input type="file" accept="image/*" ref={file} />
                </div>
            </form>
            <button onClick={() => onSubmitAction()}>{buttonContent}</button>
        </div>
    );

    const addRole = (role: Role): void => {
        setAddedRoles((currentValue) => [...currentValue, role]);
    };

    const addAvailableRole = (role: Role) => {
        setAddedRoles((currentValue: Array<Role>) => {
            const indexOfSelectedRole = currentValue?.findIndex(
                (_role: Role) => _role.id === role.id,
            );
            const prevList = currentValue.slice(0, indexOfSelectedRole);
            const endList = currentValue.slice(
                indexOfSelectedRole + 1,
                currentValue.length,
            );

            return [...prevList, ...endList];
        });
    };

    const validateInputFields = (): boolean => {
        if (firstName.trim().length < 3) {
            setExceptionMessage(LENGTH_OF_NAME_EXCEPTION);
            return false;
        }

        if (lastName.trim().length < 3) {
            setExceptionMessage(LENGTH_OF_SURNAME_EXCEPTION);
            return false;
        }

        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!email.match(pattern)) {
            setExceptionMessage(INCORRECT_EMAIL_EXCEPTION);
            return false;
        }

        if (password.trim().length < 3) {
            setExceptionMessage(LENGTH_OF_PASSWORD_EXCEPTION);
            return false;
        }

        if (file.current?.files?.item(0)?.type.split('/')[0] !== 'image') {
            setExceptionMessage(FILE_NOT_IMAGE_EXCEPTION);
            return false;
        }

        return true;
    };

    const onSubmitAction = (): void => {
        if (!validateInputFields()) return;

        const user: User = {
            id: foundUser.id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            imageBlobKey: foundUser.imageBlobKey,
            roles: addedRoles,
            password: password,
            isAdmin: false,
        };

        const userPhoto = file.current?.files?.item(0);

        if (!userPhoto) {
            setExceptionMessage(FILE_NOT_IMAGE_EXCEPTION);
            return;
        }

        if (resultActionType === ModalResultActions.Add) {
            AddNewUserAsync(user, userPhoto);
        } else if (resultActionType === ModalResultActions.Edit) {
            EditUserAsync(user, userPhoto);
        }
    };

    return (
        <div className="wrapper">
            {backgroundNode}
            {modalWindowNode}
        </div>
    );
};

export default withUserCreateUpdateModal(UserCreateAndUpdateModal);
