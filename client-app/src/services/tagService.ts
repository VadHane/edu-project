import { Tag } from './../models/Tag';
import https from './../https';

const path = '/api/models/tags/';

export const getAllTagsAsync = async (): Promise<Array<Tag>> => {
    return https.get<Array<Tag>>(path).then((response) => {
        if (response.status === 204) {
            return [];
        }

        return response.data;
    });
};

export const createNewTagAsync = async (tag: Tag) => {
    const requestBody = new FormData();

    requestBody.append('name', `${tag.name}`);

    return https.post<Tag>(path, requestBody).then((response) => response.data);
};
