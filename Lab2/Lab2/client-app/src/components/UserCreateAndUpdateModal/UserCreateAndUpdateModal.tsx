/* eslint-disable react-hooks/rules-of-hooks */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Role } from '../../models/Role';
import AddedRolesList from './AddedRolesList';
import AvailableRolesList from './AvailableRolesList';
import UserCreateAndUpdateModalProps from './UserCreateAndUpdateModal.types';
import { User } from '../../models/User';
import {
    FILE_NOT_IMAGE_EXCEPTION,
    INCORECT_USER_ID_EXCEPTION,
    INCORRECT_EMAIL_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
    LENGTH_OF_SURNAME_EXCEPTION,
    TRY_AGAIN_LATER_EXCEPTION,
} from '../../App.constants';
import './UserCreateAndUpdateModal.css';
import UserWarningModal from '../UserWarningModal';
import {
    EMAIL_PLACEHOLDER,
    FIRST_NAME_PLACEHOLDER,
    LAST_NAME_PLACEHOLDER,
} from './UserCreateAndUpdateModal.constants';

const UserCreateAndUpdateModal: FunctionComponent<UserCreateAndUpdateModalProps> = (
    props: UserCreateAndUpdateModalProps,
) => {
    const { id } = useParams();
    const foundUser = props.getUserById(id);

    if (!foundUser) {
        return <UserWarningModal message={INCORECT_USER_ID_EXCEPTION} />;
    }

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState<string>(foundUser.firstName);
    const [lastName, setLastName] = useState<string>(foundUser.lastName);
    const [email, setEmail] = useState<string>(foundUser.email);
    const [addedRoles, setAddedRoles] = useState<Array<Role>>(foundUser.roles);
    const [availableRoles, setAvailableRoles] = useState<Array<Role>>([]);
    const [exceptionMessage, setExceptionMessage] = useState<string>('');

    const file = React.createRef<HTMLInputElement>();

    useEffect(() => {
        props
            .getAllRolesAsync()
            .then((roles: Array<Role>) => setAvailableRoles([...roles]));
    }, [props]);

    useEffect(() => {
        setExceptionMessage('');
    }, [firstName, lastName, email]);

    const backgroundNode: React.ReactNode = (
        <NavLink to={'/'} title="Close modal window">
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

                    <AddedRolesList
                        roles={addedRoles}
                        removeAddedRole={(role: Role) => addAvailableRole(role)}
                    />

                    <AvailableRolesList
                        roles={availableRoles}
                        addedRoles={addedRoles}
                        addRole={(role: Role) => addRole(role)}
                        createNewRole={(role: Role) => createNewRole(role)}
                    />

                    <input type="file" accept="image/*" ref={file} />
                </div>
            </form>
            <button onClick={() => onSubmitAction()}>{props.buttonContent}</button>
        </div>
    );

    const addRole = (role: Role): void => {
        setAvailableRoles((currentValue: Array<Role>) => {
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
        setAvailableRoles((currentValue) => [...currentValue, role]);
    };

    const createNewRole = (role: Role): void => {
        props.createNewRole(role).then((role: Role) => {
            setAvailableRoles((currentValue: Array<Role>) => [...currentValue, role]);
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
        };

        const userPhoto = file.current?.files?.item(0);
        props.resultActionAsync(user, userPhoto).then((done: Boolean) => {
            if (done) {
                navigate('/');
            } else {
                setExceptionMessage(TRY_AGAIN_LATER_EXCEPTION);
            }
        });
    };

    return (
        <div className="wrapper">
            {backgroundNode}
            {modalWindowNode}
        </div>
    );
};

export default UserCreateAndUpdateModal;
