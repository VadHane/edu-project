import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteNamesEnum } from '../../types/Route.types';
import Preloader from '../../components/Preloader';
import UserTable from '../../components/UsersTable';
import WarningModal from '../../components/WarningModal';
import { useUserActions } from '../../hooks/useUserActions';
import { UNKNOWN_EXCEPTION } from '../../exceptions';
import { User } from '../../models/User';
import { Maybe } from '../../types/App.types';
import UserModal from '../../components/UserModal';

const UserPage: FunctionComponent = () => {
    const { getAllUsers, AddNewUserAsync, EditUserAsync } = useUserActions();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Nullable<string>>(null);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<Maybe<User>>(undefined);

    useEffect(() => {
        setIsLoading(true);

        getAllUsers((isDone, error) => {
            setIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            }
        });
    }, []);

    const onAddUserHandler = () => setOpenModal(true);

    const onEditUserHandler = (user: User) => {
        return () => {
            setOpenModal(true);
            setSelectedUser(user);
        };
    };

    const onCloseModalHandler = () => {
        setOpenModal(false);
        setSelectedUser(undefined);
    };

    if (isLoading) {
        return <Preloader />;
    }

    if (error) {
        return <WarningModal message={error} navigateTo={RouteNamesEnum.StartPage} />;
    }

    return (
        <>
            <UserTable
                onAddUserHandler={onAddUserHandler}
                onEditUserHandler={onEditUserHandler}
            />
            {!selectedUser ? (
                <UserModal
                    resultButtonsCaption="Add"
                    open={openModal}
                    onCloseModalHandler={onCloseModalHandler}
                    onSendFormHandler={AddNewUserAsync}
                />
            ) : (
                <UserModal
                    resultButtonsCaption="Edit"
                    open={openModal}
                    onCloseModalHandler={onCloseModalHandler}
                    user={selectedUser}
                    onSendFormHandler={EditUserAsync}
                />
            )}
        </>
    );
};

export default UserPage;
