import { Model } from '../models/Model';
import { deleteUploadedFile, uploadFile } from './fileService';
import https from './../https';

const path = '/api/models/';

const createRequestBody = async (
    model: Model,
    file: File,
    preview: File,
): Promise<FormData> => {
    const requestBody = new FormData();
    const fileKey = await uploadFile(file);
    const previewBlobKey = await uploadFile(preview);

    requestBody.append('name', model.name);
    requestBody.append('description', model.description);
    requestBody.append('tags', JSON.stringify(model.tags));
    requestBody.append('fileKey', fileKey);
    requestBody.append('prevBlobKey', previewBlobKey);

    return requestBody;
};

export const getAllModelsAsync = async (): Promise<Array<Model>> => {
    return https.get<Array<Model>>(path).then((response) => {
        if (response.status === 204) {
            return [];
        }

        return response.data;
    });
};

export const addModelAsync = async (
    model: Model,
    file: File,
    preview: File,
): Promise<Model> => {
    const requestBody = await createRequestBody(model, file, preview);

    return https.post<Model>(path, requestBody).then((response) => {
        if (response.status === 400) {
            throw new Error();
        }

        return response.data;
    });
};

export const editModelAsync = async (
    model: Model,
    file: File,
    preview: File,
): Promise<Model> => {
    const requestBody = await createRequestBody(model, file, preview);
    const requestUrl = `${path}${model.id}`;

    deleteUploadedFile(model.prevBlobKey);

    return https.put<Model>(requestUrl, requestBody).then((response) => response.data);
};

export const deleteModelAsync = async (model: Model): Promise<Model> => {
    const requestUrl = `${path}${model.id}`;

    model.modelHistory.forEach((mh) => {
        deleteUploadedFile(mh.fileKey);
    });

    deleteUploadedFile(model.prevBlobKey);

    return https.delete(requestUrl).then((response) => response.data);
};
