import React, { FunctionComponent, useEffect, useState } from 'react';
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import { getAllUsersAsync } from '../../services/userService';
import TableContentRow from './TableContentRow/TableContentRow';
import { Route, Routes } from 'react-router-dom';
import UserCreateAndUpdateModal from './UserCreateAndUpdateModal/UserCreateAndUpdateModal';
import AddUserButton from '../AddUserButton/AddUserButton';
import UsersTableProps from './UsersTable.types';
import './UsersTable.css';

const UsersTable: FunctionComponent<UsersTableProps> = (props) => {
    const [users, setUsers] = useState<Array<User>>([]);

    useEffect(() => {
        getAllUsersAsync().then((data: Array<User>) => {
            setUsers(data);
        });
    }, []);

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
                    <th className="picture">Picture</th>
                    <th className="name">First name</th>
                    <th className="surname">Last name</th>
                    <th className="email">Email</th>
                    <th className="roles">Roles</th>
                    <th className="actions">Actions</th>
                </tr>
            </thead>
        </table>
    );

    const createNewUser = (user: User, image: File): Promise<boolean> => {
        return props
            .createUserAsync(user, image)
            .then((data: User): boolean => {
                if (data) {
                    setUsers((currentValue: Array<User>) => [...currentValue, data]);
                    return true;
                }
                return false;
            })
            .catch(() => false);
    };

    const editUser = (user: User, image: File): Promise<boolean> => {
        return props
            .editUserAsync(user, image)
            .then((data: User): boolean => {
                if (data) {
                    setUsers((currentValue: Array<User>) => {
                        const indexOfSelectedUser = currentValue?.findIndex(
                            (_user: User) => _user.id === user.id,
                        );

                        const prevList = currentValue.slice(0, indexOfSelectedUser);
                        const endList = currentValue.slice(
                            indexOfSelectedUser + 1,
                            currentValue.length,
                        );

                        return [...prevList, data, ...endList];
                    });
                    return true;
                }
                return false;
            })
            .catch(() => false);
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

    const getUserById = (id: string | undefined): User => {
        if (!id) {
            const emptyUser: User = {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                imageBlobKey: '',
                roles: [],
            };

            return emptyUser;
        }

        const index = users.findIndex((user: User) => user.id === id);
        return users[index];
    };

    return (
        <div className="list">
            <Routes>
                <Route
                    path="/add"
                    element={
                        <UserCreateAndUpdateModal
                            getUserById={(id: string | undefined) => getUserById(id)}
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
                            getUserById={(id: string | undefined) => getUserById(id)}
                            buttonContent={'Add new user'}
                            getAllRolesAsync={() => props.getAllRolesAsync()}
                            createNewRole={(role: Role) => props.createNewRole(role)}
                            resultActionAsync={(user: User, file: File) =>
                                editUser(user, file)
                            }
                        />
                    }
                />
            </Routes>

            <AddUserButton />
            {tableHeaderNode}
            {usersRowsNode}
        </div>
    );
};

export default UsersTable;
