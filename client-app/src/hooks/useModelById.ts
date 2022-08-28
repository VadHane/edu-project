import { useNavigate, useParams } from 'react-router-dom';
import { Model } from '../models/Model';
import { RouteNamesEnum } from '../types/Route.types';
import { getModelByIdAsync } from './../services/modelService';

const emptyModel: Model = {
    id: '',
    name: '',
    filekey: '',
    prevBlobKey: '',
    description: '',
    createdAt: new Date(),
    createdBy: '',
    updatedAt: new Date(),
    updatedBy: '',
    tags: [],
    modelHistory: [],
};

export const useModelById = () => {
    const { modelId } = useParams();
    const navigate = useNavigate();

    if (!modelId) {
        navigate(RouteNamesEnum.PageNotFound);
    } else {
        return getModelByIdAsync(modelId).then((model) => model);
    }

    return emptyModel;
};
