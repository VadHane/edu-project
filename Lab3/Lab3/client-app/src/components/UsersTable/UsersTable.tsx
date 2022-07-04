import React, { FunctionComponent, useEffect } from 'react';
import { User } from '../../models/User';
import TableContentRow from './TableContentRow';
import './UsersTable.css';
import {
    ACTIONS_COLUMN_HEADER,
    EMAIL_COLUMN_HEADER,
    FIRST_NAME_COLUMN_HEADER,
    LAST_NAME_COLUMN_HEADER,
    PICTURE_COLUMN_HEADER,
    ROLES_COLUMN_HEADER,
} from './UsersTable.constants';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useUserActions } from '../../hooks/useUserActions';
import AddUserButton from '../AddUserButton';
import { withLoading } from './../../hoc/withLoading';

const UsersTable: FunctionComponent = () => {
    const { users, loaded } = useTypedSelector((state) => state.user);
    const { getAllUsers } = useUserActions();

    useEffect(() => {
        if (!loaded) {
            getAllUsers();
        }
    }, [getAllUsers, loaded]);

    const usersRowsNode: React.ReactNode = (
        <div className="scroll-list">
            <table>
                <tbody>
                    {users.map(
                        (user: User): JSX.Element => (
                            <TableContentRow key={user.id} user={user} />
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

    return (
        <div className="list">
            <AddUserButton />
            {tableHeaderNode}
            {usersRowsNode}
        </div>
    );
};

export default withLoading(UsersTable);
