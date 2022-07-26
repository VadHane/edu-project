import { FetchMethodsEnum } from '../types/Auth.types';
import { Tag } from './../models/Tag';
import { authFetch } from './authService';

const url = `${process.env.REACT_APP_HOST_URL}/api/models/tags/`;

export const getAllTagsAsync = async (): Promise<Array<Tag>> => {
    return authFetch(url)
        .then((response: Response) => response.json())
        .then((data: Array<Tag>) => data);
};

export const createNewTagAsync = async (tag: Tag) => {
    const requestBody = new FormData();

    requestBody.append('name', `${tag.name}`);

    return authFetch(url, {
        method: FetchMethodsEnum.POST,
        body: requestBody,
    })
        .then((response: Response) => response.json())
        .then((data: Tag) => data);
};
