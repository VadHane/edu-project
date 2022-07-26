import React, { FunctionComponent, useEffect, useState } from 'react';
import { ModalResultActions } from '../../types/App.types';
import { ModelCreateAndUpdateModalProps } from './ModelCreateAndUpdateModal.types';
import { withModalCreateUpdateModal } from './../../hoc/withModelCreateUpdateModal';
import { NavLink, useParams } from 'react-router-dom';
import { useModelById } from '../../hooks/useModelById';
import {
    DESCRIPTION_PLACEHOLDER,
    emptyModel,
    NAME_PLACEHOLDER,
} from './ModelCreateAndUpdateModal.constants';
import { Tag } from '../../models/Tag';
import { useModelActions } from '../../hooks/useModelActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useTagActions } from '../../hooks/useTagActions';
import { RouteNamesEnum } from '../../types/Route.types';
import Preloader from '../Preloader';
import WarningModal from '../WarningModal';
import {
    FILE_NOT_CAD_EXCEPTION,
    FILE_NOT_IMAGE_EXCEPTION,
    LENGTH_OF_DESCRIPTION_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
} from '../../exceptions';
import { Model } from '../../models/Model';
import AssignedTagsList from './AssignedTagsList';
import AvailableTagsList from './AvailableTagsList';
import './ModelCreateAndUpdateModal.css';

const ModelCreateAndUpdateModal: FunctionComponent<ModelCreateAndUpdateModalProps> = ({
    buttonContent,
    resultActionType,
}) => {
    const { id } = useParams();

    const foundModel = useModelById(id) || emptyModel;

    const [name, setName] = useState<string>(foundModel.name);
    const [description, setDescription] = useState<string>(foundModel.description);

    const [assignedTags, setAssignetTags] = useState<Array<Tag>>(foundModel.tags);

    const [exceptionMessage, setExceptionMessage] = useState<string>('');

    const file = React.createRef<HTMLInputElement>();
    const preview = React.createRef<HTMLInputElement>();

    const { addNewModel, editModel } = useModelActions();
    const { loading, error } = useTypedSelector((state) => state.model);
    const { getAllTags } = useTagActions();

    useEffect(() => {
        getAllTags();
    }, []);

    useEffect(() => {
        setExceptionMessage('');
    }, [name, description]);

    if (loading) {
        return <Preloader />;
    }

    if (error) {
        return <WarningModal message={error} navigateTo={RouteNamesEnum.Models} />;
    }

    const backgroundNode: React.ReactNode = (
        <NavLink to={RouteNamesEnum.Models} title="Close modal window">
            <div className="background"></div>
        </NavLink>
    );

    const exceptionString: React.ReactNode = (
        <div className="exception-message">
            <span>{exceptionMessage}</span>
        </div>
    );

    const modalWindowNode: React.ReactNode = (
        <div className="window">
            <form>
                <div className="formRows">
                    <br />
                    {exceptionString}
                    <input
                        type="text"
                        name="name"
                        placeholder={NAME_PLACEHOLDER}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <br />

                    <input
                        type="text"
                        name="description"
                        placeholder={DESCRIPTION_PLACEHOLDER}
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                    <br />

                    <AssignedTagsList
                        tags={assignedTags}
                        removeTag={(tag: Tag) => removeTag(tag)}
                    />

                    <AvailableTagsList
                        tags={assignedTags}
                        assignedTag={(tag: Tag) => addTag(tag)}
                    />

                    <input type="file" accept=".cad" ref={file} />
                    <input type="file" accept="image/*" ref={preview} />
                </div>
            </form>
            <button onClick={() => onSubmitAction()}>{buttonContent}</button>
        </div>
    );

    const addTag = (tag: Tag): void => {
        setAssignetTags((current) => [...current, tag]);
    };

    const removeTag = (tag: Tag) => {
        setAssignetTags((current) => {
            const indexOfSelectedRole = current?.findIndex(
                (_tag: Tag) => _tag.id === tag.id,
            );
            const prevList = current.slice(0, indexOfSelectedRole);
            const endList = current.slice(indexOfSelectedRole + 1, current.length);

            return [...prevList, ...endList];
        });
    };

    const validateInputFields = (): boolean => {
        if (name.trim().length < 3) {
            setExceptionMessage(LENGTH_OF_NAME_EXCEPTION);
            return false;
        }

        if (description.trim().length < 3) {
            setExceptionMessage(LENGTH_OF_DESCRIPTION_EXCEPTION);
            return false;
        }

        if (file.current?.files?.item(0)?.name.split('.')[1] !== 'cad') {
            setExceptionMessage(FILE_NOT_CAD_EXCEPTION);
            return false;
        }

        if (preview.current?.files?.item(0)?.type.split('/')[0] !== 'image') {
            setExceptionMessage(FILE_NOT_IMAGE_EXCEPTION);
            return false;
        }

        return true;
    };

    const onSubmitAction = (): void => {
        if (!validateInputFields()) {
            return;
        }

        const model: Model = {
            id: foundModel.id,
            name: name,
            fileKey: foundModel.fileKey,
            prevBlobKey: foundModel.prevBlobKey,
            description: description,
            createdAt: foundModel.createdAt,
            createdBy: foundModel.createdBy,
            updatedAt: new Date(),
            updatedBy: foundModel.updatedBy,
            tags: assignedTags,
            modelHistory: foundModel.modelHistory,
        };

        const _file = file.current?.files?.item(0);
        const _preview = preview.current?.files?.item(0);

        if (!_file) {
            setExceptionMessage(FILE_NOT_CAD_EXCEPTION);
            return;
        }

        if (!_preview) {
            setExceptionMessage(FILE_NOT_IMAGE_EXCEPTION);
            return;
        }

        if (resultActionType === ModalResultActions.Add) {
            addNewModel(model, _file, _preview);
        } else if (resultActionType === ModalResultActions.Edit) {
            editModel(model, _file, _preview);
        }
    };

    return (
        <div className="wrapper">
            {backgroundNode}
            {modalWindowNode}
        </div>
    );
};

export default withModalCreateUpdateModal(ModelCreateAndUpdateModal);
