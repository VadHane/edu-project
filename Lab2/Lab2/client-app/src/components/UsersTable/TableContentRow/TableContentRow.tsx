import React, { useState, useEffect, FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../../models/Role';
import { User } from '../../../models/User';
import { TableContentRowProps } from './TableContentRow.types';
import { EDIT_IMAGE, REMOVE_IMAGE, USER_DEFAULT_PICTURE } from '../../../constants';
import './TableContentRow.css';

const TableContentRow: FunctionComponent<TableContentRowProps> = (
    props: TableContentRowProps,
) => {
    const [user, setUser] = useState<User>(props.user);
    const [userPhotoUrl, setUserPhotoUrl] = useState<string>('');
    const navigate = useNavigate();

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

    const onEditHandler = () => {
        const navigateTo = `/edit/${user.id}`;

        navigate(navigateTo);
    };

    const onDeleteHandler = () => {
        props.onDelete(user);
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
                <img src={EDIT_IMAGE.URL} alt={EDIT_IMAGE.ALT} onClick={onEditHandler} />
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
