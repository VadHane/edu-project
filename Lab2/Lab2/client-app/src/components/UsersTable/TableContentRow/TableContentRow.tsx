import React, { useState, useEffect, FunctionComponent } from 'react';
import { Role } from '../../../models/Role';
import { User } from '../../../models/User';
import { TableContentRowProps } from './TableContentRow.types';
import './TableContentRow.css';
import { EDIT_IMAGE_URL, REMOVE_IMAGE_URL, USER_PICTURE_URL } from '../../../constants';

const TableContentRow: FunctionComponent<TableContentRowProps> = (
    props: TableContentRowProps,
) => {
    const [user, setUser] = useState<User>(props.user);

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    const getImagePath = (): string => {
        if (props.user.imageBlobKey !== null) {
            return `${process.env.REACT_APP_HOST_URL}/${props.user.imageBlobKey}`;
        }

        return USER_PICTURE_URL;
    };

    return (
        <tr>
            <th className="picture">
                <img src={getImagePath()} alt="UserPhoto" />
            </th>
            <th className="name">{user.firstName}</th>
            <th className="surname">{user.lastName}</th>
            <th className="email">{user.email}</th>
            <th className="roles">
                {user.roles.map((role: Role): string => `${role.name}; `)}
            </th>
            <th className="actions">
                <img
                    src={EDIT_IMAGE_URL}
                    alt="Edit"
                    onClick={() => props.onEdit(user.id)}
                />
                <img
                    src={REMOVE_IMAGE_URL}
                    alt="Delete"
                    onClick={() => props.onDelete(user.id)}
                />
            </th>
        </tr>
    );
};

export default TableContentRow;
