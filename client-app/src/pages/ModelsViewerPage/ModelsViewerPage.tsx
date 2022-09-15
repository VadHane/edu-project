import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModelsViewer from '../../components/ModelsViewer';
import { getModelByIdAsync } from '../../services/modelService';
import { RouteNamesEnum } from '../../types/Route.types';
import { signUrl } from './../../services/fileService';
import CircularProgress from '@mui/material/CircularProgress';

const fileStorageUrl = `${process.env.REACT_APP_FILE_STORAGE_URL}/api/file/`;

const ModelsViewerPage: FunctionComponent = () => {
    const { modelId } = useParams();
    const navigate = useNavigate();

    const [fileUrl, setFileUrl] = useState<string>();

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

    const preloader: React.ReactNode = (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgress />
        </div>
    );

    return <>{fileUrl ? <ModelsViewer fileUrl={fileUrl} /> : preloader}</>;
};

export default ModelsViewerPage;
