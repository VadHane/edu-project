import { User } from '../models/User';

const url = `${process.env.REACT_APP_HOST_URL}/api/users/`;

export const getAllUsersAsync = async (): Promise<Array<User>> => {
    return fetch(url)
        .then((response) => response.json())
        .then((data: Array<User>) => data);
};

export const addUserAsync = async (user: User, file: File): Promise<User> => {
    const requestBody = new FormData();

    requestBody.append('firstName', user.firstName);
    requestBody.append('lastName', user.lastName);
    requestBody.append('email', user.email);
    requestBody.append('files', file);
    requestBody.append('roles', JSON.stringify(user.roles));

    return fetch(url, {
        method: 'POST',
        body: requestBody,
    })
        .then((response) => response.json())
        .then((data: User) => data);
};

export const editUserAsync = async (user: User, file: File): Promise<User> => {
    const requestBody = new FormData();

    requestBody.append('firstName', user.firstName);
    requestBody.append('lastName', user.lastName);
    requestBody.append('email', user.email);
    requestBody.append('roles', JSON.stringify(user.roles));

    if (file) {
        requestBody.append('files', file);
    }

    const requestUrl = `${url}${user.id}`;

    return fetch(requestUrl, {
        method: 'PUT',
        body: requestBody,
    })
        .then((response) => response.json())
        .then((data: User) => data);
};

export const deleteUserAsync = async (user: User): Promise<User> => {
    const requestUrl = `${url}${user.id}`;

    return fetch(requestUrl, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data: User) => data);
};
