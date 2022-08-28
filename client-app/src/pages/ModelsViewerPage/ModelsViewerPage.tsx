import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModelsViewer from '../../components/ModelsViewer';
import { getModelByIdAsync } from '../../services/modelService';
import { RouteNamesEnum } from '../../types/Route.types';
import { signUrl } from './../../services/fileService';

const fileStorageUrl = `${process.env.REACT_APP_FILE_STORAGE_URL}/api/file/`;

const ModelsViewerPage: FunctionComponent = () => {
    const { modelId } = useParams();
    const navigate = useNavigate();

    const [fileUrl, setFileUrl] = useState<string>('');

    useEffect(() => {
        if (!modelId) {
            navigate(RouteNamesEnum.PageNotFound);
        } else {
            getModelByIdAsync(modelId).then((model) => {
                if (!model?.filekey) {
                    navigate(RouteNamesEnum.PageNotFound);
                }

                const unsignedUrl = `${fileStorageUrl}${model.filekey}`;

                signUrl(unsignedUrl).then((signUrl) => setFileUrl(signUrl));
            });
        }
    }, [modelId]);

    return <ModelsViewer fileUrl={fileUrl} />;
};

export default ModelsViewerPage;
