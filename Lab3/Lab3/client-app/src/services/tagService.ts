import { Tag } from './../models/Tag';

const url = `${process.env.REACT_APP_HOST_URL}/api/models/tags/`;

export const getAllTagsAsync = async (): Promise<Array<Tag>> => {
    return fetch(url)
        .then((response: Response) => response.json())
        .then((data: Array<Tag>) => data);
};

export const createNewTagAsync = async (tag: Tag) => {
    const requestBody = new FormData();

    requestBody.append('name', `${tag.name}`);

    return fetch(url, {
        method: 'POST',
        body: requestBody,
    })
        .then((response: Response) => response.json())
        .then((data: Tag) => data);
};
