import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Model } from '../../../models/Model';
import { TableContentRowProps } from './TableContentRow.types';
import { useModelActions } from './../../../hooks/useModelActions';
import { EDIT_IMAGE, MODEL_DEFAULT_PICTURE, REMOVE_IMAGE } from '../../../App.constants';
import { getUserByIdAsync } from '../../../services/userService';
import { User } from '../../../models/User';
import { DEFAULT_OWNER_NAME } from './TableContentRow.constants';
import { Tag } from '../../../models/Tag';
import './TableContentRow.css';

const TableContentRow: FunctionComponent<TableContentRowProps> = (
    props: TableContentRowProps,
) => {
    const navigate = useNavigate();

    const [model, setModel] = useState<Model>(props.model);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [updaterName, setUpdaterName] = useState<string>('');

    const { deleteModel } = useModelActions();

    useEffect(() => {
        getUserByIdAsync(model.updatedBy)
            .then((data: User) => {
                setUpdaterName(data.firstName + data.lastName);
            })
            .catch(() => {
                setUpdaterName(DEFAULT_OWNER_NAME);
            });
    }, [model.updatedBy]);

    useEffect(() => {
        setModel(props.model);
    }, [props.model]);

    useEffect(() => {
        const photoUrl = `${process.env.REACT_APP_HOST_URL}/${props.model.previewBlobKey}`;

        setPreviewUrl(photoUrl);
    }, [props.model.previewBlobKey]);

    const onFailedLoadPhoto = () => {
        setPreviewUrl(MODEL_DEFAULT_PICTURE.URL);
    };

    const onEditHandler = () => {
        const navigateTo = `/models/edit/${model.id}`;

        navigate(navigateTo);
    };

    const onDeleteHandler = () => {
        deleteModel(model);
    };

    return (
        <tr>
            <th className="picture">
                <img
                    src={previewUrl}
                    alt={MODEL_DEFAULT_PICTURE.ALT}
                    onError={onFailedLoadPhoto}
                />
            </th>
            <th className="name">{model.name}</th>
            <th className="desctiption">{model.description}</th>
            <th className="tags">
                {model.tags.map((tag: Tag): string => `${tag.name}; `)}
            </th>
            <th className="last-update">{`${model.updatedAt} by ${updaterName}`}</th>
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