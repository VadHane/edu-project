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
    ACTIONS_COLUMNHEADER,
    EMAIL_COLUMNHEADER,
    FIRST_NAME_COLUMNHEADER,
    LAST_NAME_COLUMNHEADER,
    PICTURE_COLUMNHEADER,
    ROLES_COLUMNHEADER,
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
                    <th className="picture">{PICTURE_COLUMNHEADER}</th>
                    <th className="name">{FIRST_NAME_COLUMNHEADER}</th>
                    <th className="surname">{LAST_NAME_COLUMNHEADER}</th>
                    <th className="email">{EMAIL_COLUMNHEADER}</th>
                    <th className="roles">{ROLES_COLUMNHEADER}</th>
                    <th className="actions">{ACTIONS_COLUMNHEADER}</th>
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
                            buttonContent={'Add new user'}
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
                            buttonContent={'Edit'}
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
