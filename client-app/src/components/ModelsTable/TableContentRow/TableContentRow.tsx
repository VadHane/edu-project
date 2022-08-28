import React, { FunctionComponent, useEffect, useState } from 'react';
import { Model } from '../../../models/Model';
import { TableContentRowProps } from './TableContentRow.types';
import { useModelActions } from './../../../hooks/useModelActions';
import { EDIT_IMAGE, MODEL_DEFAULT_PICTURE, REMOVE_IMAGE } from '../../../App.constants';
import { getUserByIdAsync } from '../../../services/userService';
import { User } from '../../../models/User';
import { DEFAULT_OWNER_NAME } from './TableContentRow.constants';
import { Tag } from '../../../models/Tag';
import { signUrl } from './../../../services/fileService';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import './TableContentRow.css';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RouteNamesEnum } from '../../../types/Route.types';

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
                setUpdaterName(`${data.firstName} ${data.lastName}`);
            })
            .catch(() => {
                setUpdaterName(DEFAULT_OWNER_NAME);
            });
    }, [model.updatedBy]);

    useEffect(() => {
        setModel(props.model);
    }, [props.model]);

    useEffect(() => {
        const photoUrl = `${process.env.REACT_APP_FILE_STORAGE_URL}/api/file/${model.prevBlobKey}`;

        signUrl(photoUrl).then((signedUrl) => {
            setPreviewUrl(signedUrl);
        });
    }, [model.prevBlobKey]);

    const onFailedLoadPhoto = () => {
        setPreviewUrl(MODEL_DEFAULT_PICTURE.URL);
    };

    const onDeleteHandler = () => {
        deleteModel(model);
    };

    const getDataTimeString = (date: Date) => {
        const _date = new Date(date);
        const resString = `${_date.getDay()}/${
            _date.getMonth() + 1
        }/${_date.getFullYear()} ${_date.getHours()}:${_date.getMinutes()}`;

        return resString;
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
            <th className="last-update">
                {`${getDataTimeString(model.updatedAt)} by ${updaterName}`}
            </th>
            <th className="actions">
                <img
                    src={EDIT_IMAGE.URL}
                    alt={EDIT_IMAGE.ALT}
                    onClick={props.onEditModelHandler(model)}
                />
                <img
                    src={REMOVE_IMAGE.URL}
                    alt={REMOVE_IMAGE.ALT}
                    onClick={onDeleteHandler}
                />
                <IconButton
                    onClick={() =>
                        navigate(`${RouteNamesEnum.ModelViewerForNavigate}${model.id}`)
                    }
                >
                    <RemoveRedEyeIcon />
                </IconButton>
            </th>
        </tr>
    );
};

export default TableContentRow;
