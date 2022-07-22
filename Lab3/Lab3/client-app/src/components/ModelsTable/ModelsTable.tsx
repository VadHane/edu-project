import React, { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Model } from '../../models/Model';
import { RouteNamesEnum } from '../../types/Route.types';
import Preloader from '../Preloader';
import WarningModal from '../WarningModal';
import { useModelActions } from './../../hooks/useModelActions';
import {
    ACTIONS_COLUMN_HEADER,
    ADD_MODEL_BUTTON_TEXT,
    DESCRIPTION_COLUMN_HEADER,
    LAST_UPDATE_COLUMN_HEADER,
    NAME_COLUMN_HEADER,
    PREVIEW_COLUMN_HEADER,
    TAGS_COLUNM_HEADER,
} from './ModelsTable.constants';
import TableContentRow from './TableContentRow';

const ModelsTable: FunctionComponent = () => {
    const navigate = useNavigate();

    const { models, loading, error } = useTypedSelector((state) => state.model);
    const { getAllModels } = useModelActions();

    useEffect(() => {
        getAllModels();
    }, []);

    if (loading) {
        return <Preloader />;
    }

    if (error) {
        return <WarningModal message={error} navigateTo={RouteNamesEnum.Models} />;
    }

    const onClickButton = () => {
        navigate(RouteNamesEnum.Add);
    };

    const addModelButton: React.ReactNode = (
        <button onClick={onClickButton}>{ADD_MODEL_BUTTON_TEXT}</button>
    );

    const tableHeadersNode: React.ReactNode = (
        <table>
            <thead>
                <tr>
                    <th className="picture">{PREVIEW_COLUMN_HEADER}</th>
                    <th className="name">{NAME_COLUMN_HEADER}</th>
                    <th className="desctiption">{DESCRIPTION_COLUMN_HEADER}</th>
                    <th className="tags">{TAGS_COLUNM_HEADER}</th>
                    <th className="last-update">{LAST_UPDATE_COLUMN_HEADER}</th>
                    <th className="actions">{ACTIONS_COLUMN_HEADER}</th>
                </tr>
            </thead>
        </table>
    );

    const modelRowsNode: React.ReactNode = (
        <div className="scroll-list">
            <table>
                <tbody>
                    {models.map(
                        (model: Model): JSX.Element => (
                            <TableContentRow key={model.id} model={model} />
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <>
            {addModelButton}
            {tableHeadersNode}
            {modelRowsNode}
        </>
    );
};

export default ModelsTable;
