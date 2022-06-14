import React, { FunctionComponent, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import TableContentRow from './TableContentRow';
import UserCreateAndUpdateModal from '../UserCreateAndUpdateModal';
import AddUserButton from '../AddUserButton';
import UsersTableProps from './UsersTable.types';
import UserWarningModal from '../UserWarningModal';
import { Maybe } from '../../types';
import { INCORRECT_PATH_EXCEPTION } from '../../App.constants';
import './UsersTable.css';
import {
    ACTIONS_COLUMN_HEADER,
    ADD_USER_BUTTON_TEXT,
    EDIT_USER_BUTTON_TEXT,
    EMAIL_COLUMN_HEADER,
    FIRST_NAME_COLUMN_HEADER,
    LAST_NAME_COLUMN_HEADER,
    PICTURE_COLUMN_HEADER,
    ROLES_COLUMN_HEADER,
} from './UsersTable.constants';

const UsersTable: FunctionComponent<UsersTableProps> = (props) => {
    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        props.getAllUsersAsync().then((data: Array<User>) => {
            setUsers(data);
        });
    }, [props]);

    const usersRowsNode: React.ReactNode = (
        <div className="scroll-list">
            <table>
                <tbody>
                    {users.map(
                        (user: User): JSX.Element => (
                            <TableContentRow
                                key={user.id}
                                user={user}
                                onDelete={(user: User) => {
                                    deleteUser(user);
                                }}
                            />
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );

    const tableHeaderNode: React.ReactNode = (
        <table>
            <thead>
                <tr>
                    <th className="picture">{PICTURE_COLUMN_HEADER}</th>
                    <th className="name">{FIRST_NAME_COLUMN_HEADER}</th>
                    <th className="surname">{LAST_NAME_COLUMN_HEADER}</th>
                    <th className="email">{EMAIL_COLUMN_HEADER}</th>
                    <th className="roles">{ROLES_COLUMN_HEADER}</th>
                    <th className="actions">{ACTIONS_COLUMN_HEADER}</th>
                </tr>
            </thead>
        </table>
    );

    const createNewUser = async (user: User, image: File): Promise<boolean> => {
        try {
            const createdUser = await props.createUserAsync(user, image);

            if (!createdUser) {
                return false;
            }

            setUsers((currentValue: Array<User>) => [...currentValue, createdUser]);
            return true;
        } catch {
            return false;
        }
    };

    const editUser = async (user: User, image: File): Promise<boolean> => {
        try {
            const editedUser = await props.editUserAsync(user, image);

            if (!editUser) {
                return false;
            }

            setUsers((currentValue: Array<User>) => {
                const indexOfSelectedUser = currentValue?.findIndex(
                    (_user: User) => _user.id === user.id,
                );

                const prevList = currentValue.slice(0, indexOfSelectedUser);
                const endList = currentValue.slice(
                    indexOfSelectedUser + 1,
                    currentValue.length,
                );

                return [...prevList, editedUser, ...endList];
            });
            return true;
        } catch {
            return false;
        }
    };

    const deleteUser = (user: User): void => {
        props.deleteUserAsync(user).then((user: User) => {
            setUsers((currentValue: Array<User>) => {
                const indexOfSelectedUser = currentValue?.findIndex(
                    (_user: User) => _user.id === user.id,
                );

                const prevList = currentValue.slice(0, indexOfSelectedUser);
                const endList = currentValue.slice(
                    indexOfSelectedUser + 1,
                    currentValue.length,
                );

                return [...prevList, ...endList];
            });
        });
    };

    const emptyUser: User = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        imageBlobKey: null,
        roles: [],
    };

    const getUserById = (id?: string): Maybe<User> => {
        if (!id) {
            return undefined;
        }

        const index = users.findIndex((user: User) => user.id === id);

        if (index === -1) {
            return undefined;
        }

        return users[index];
    };

    return (
        <div className="list">
            <Routes>
                <Route path="/" element={<AddUserButton />} />
                <Route
                    path="/add"
                    element={
                        <UserCreateAndUpdateModal
                            getUserById={(id?: string) => emptyUser}
                            buttonContent={ADD_USER_BUTTON_TEXT}
                            getAllRolesAsync={() => props.getAllRolesAsync()}
                            createNewRole={(role: Role) => props.createNewRole(role)}
                            resultActionAsync={(user: User, file: File) =>
                                createNewUser(user, file)
                            }
                        />
                    }
                />
                <Route
                    path="/edit/:id"
                    element={
                        <UserCreateAndUpdateModal
                            getUserById={(id?: string) => getUserById(id)}
                            buttonContent={EDIT_USER_BUTTON_TEXT}
                            getAllRolesAsync={() => props.getAllRolesAsync()}
                            createNewRole={(role: Role) => props.createNewRole(role)}
                            resultActionAsync={(user: User, file: File) =>
                                editUser(user, file)
                            }
                        />
                    }
                />
                <Route
                    path="*"
                    element={<UserWarningModal message={INCORRECT_PATH_EXCEPTION} />}
                />
            </Routes>

            {tableHeaderNode}
            {usersRowsNode}
        </div>
    );
};

export default UsersTable;
