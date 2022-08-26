import React, { useState, useEffect, FunctionComponent } from 'react';
import { Role } from '../../../models/Role';
import { User } from '../../../models/User';
import { TableContentRowProps } from './TableContentRow.types';
import { EDIT_IMAGE, REMOVE_IMAGE, USER_DEFAULT_PICTURE } from '../../../App.constants';
import './TableContentRow.css';
import { useUserActions } from '../../../hooks/useUserActions';

const TableContentRow: FunctionComponent<TableContentRowProps> = (
    props: TableContentRowProps,
) => {
    const [user, setUser] = useState<User>(props.user);
    const [userPhotoUrl, setUserPhotoUrl] = useState<string>('');

    const { DeleteUserAsync } = useUserActions();

    useEffect(() => {
        setUser(props.user);
    }, [props.user]);

    useEffect(() => {
        const photoUrl = `${process.env.REACT_APP_HOST_URL}/${props.user.imageBlobKey}`;

        setUserPhotoUrl(photoUrl);
    }, [props.user.imageBlobKey]);

    const onFailedLoadPhoto = () => {
        setUserPhotoUrl(USER_DEFAULT_PICTURE.URL);
    };

    const onDeleteHandler = () => {
        DeleteUserAsync(user);
    };

    return (
        <tr>
            <th className="picture">
                <img
                    src={userPhotoUrl}
                    alt={USER_DEFAULT_PICTURE.ALT}
                    onError={onFailedLoadPhoto}
                />
            </th>
            <th className="name">{user.firstName}</th>
            <th className="surname">{user.lastName}</th>
            <th className="email">{user.email}</th>
            <th className="roles">
                {user.roles.map((role: Role): string => `${role.name}; `)}
            </th>
            <th className="actions">
                <img
                    src={EDIT_IMAGE.URL}
                    alt={EDIT_IMAGE.ALT}
                    onClick={props.onEditHandler(user)}
                />
                <img
                    src={REMOVE_IMAGE.URL}
                    alt={REMOVE_IMAGE.ALT}
                    onClick={onDeleteHandler}
                />
            </th>
        </tr>
    );
};

export default TableContentRow;
