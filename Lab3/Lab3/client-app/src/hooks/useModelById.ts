import { Model } from '../models/Model';
import { Maybe } from '../types/App.types';
import { useTypedSelector } from './useTypedSelector';

export const useModelById = (id: Maybe<string>): Model => {
    const { models } = useTypedSelector((state) => state.model);

    const emptyModel: Model = {
        id: '',
        name: '',
        fileKey: '',
        prevBlobKey: '',
        description: '',
        createdAt: new Date(),
        createdBy: '',
        updatedAt: new Date(),
        updatedBy: '',
        tags: [],
        history: [],
    };

    if (!id) {
        return emptyModel;
    }

    const foundModel = models.find((model) => model.id === id);

    if (!foundModel) {
        throw new Error();
    }

    return foundModel;
};
