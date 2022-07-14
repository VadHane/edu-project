import { Model } from '../../models/Model';

export const MODEL_WAS_ADDED_MESSAGE = 'Model was added!';
export const MODEL_WAS_EDITED_MESSAGE = 'Model was edited!';

export const emptyModel: Model = {
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
    modelHistory: [],
};

export const NAME_PLACEHOLDER = 'Name';
export const DESCRIPTION_PLACEHOLDER = 'Description';
