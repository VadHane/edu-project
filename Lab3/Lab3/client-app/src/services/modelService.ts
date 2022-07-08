import { Model } from '../models/Model';

const url = `${process.env.REACT_APP_HOST_URL}/api/models/`;

const createRequestBody = (model: Model, file: File, preview: File): FormData => {
    const requestBody = new FormData();
    const tempUserId = '25946338-10d3-48df-8b6e-90a8d14c63a6';

    requestBody.append('name', model.name);
    requestBody.append('description', model.description);
    requestBody.append('createdBy', tempUserId);
    requestBody.append('updatedBy', tempUserId);
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
        .then((response) => {
            if (response.status === 400) {
                throw new Error();
            }

            return response.json();
        })
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
