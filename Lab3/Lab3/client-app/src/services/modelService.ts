import { Model } from '../models/Model';

const url = `${process.env.REACT_APP_HOST_URL}/api/models/`;

const createRequestBody = (model: Model, file: File, preview: File): FormData => {
    const requestBody = new FormData();

    requestBody.append('name', model.name);
    requestBody.append('description', model.description);
    requestBody.append('createdBy', model.createdBy);
    requestBody.append('updatedBy', model.updatedBy);
    requestBody.append('tags', JSON.stringify(model.tags));
    requestBody.append('file', file);
    requestBody.append('preview', preview);

    return requestBody;
};

export const getAllModelsAsync = async (): Promise<Array<Model>> => {
    return fetch(url)
        .then((response) => response.json())
        .then((data: Array<Model>) => data);
};

export const addModelAsync = async (
    model: Model,
    file: File,
    preview: File,
): Promise<Model> => {
    const requestBody = createRequestBody(model, file, preview);

    return fetch(url, {
        method: 'POST',
        body: requestBody,
    })
        .then((response) => response.json())
        .then((data: Model) => data);
};

export const editModelAsync = async (
    model: Model,
    file: File,
    preview: File,
): Promise<Model> => {
    const requestBody = createRequestBody(model, file, preview);
    const requestUrl = `${url}${model.id}`;

    return fetch(requestUrl, {
        method: 'PUT',
        body: requestBody,
    })
        .then((response) => response.json())
        .then((data: Model) => data);
};

export const deleteModelAsync = async (model: Model): Promise<Model> => {
    const requestUrl = `${url}${model.id}`;

    return fetch(requestUrl, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data: Model) => data);
};
