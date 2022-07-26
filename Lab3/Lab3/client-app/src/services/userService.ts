import { User } from '../models/User';
import { FetchMethodsEnum } from '../types/Auth.types';
import { authFetch } from './authService';

const url = `${process.env.REACT_APP_HOST_URL}/api/users/`;

export const getAllUsersAsync = async (): Promise<Array<User>> => {
    return authFetch(url)
        .then((response) => {
            if (response.status === 204) {
                return [];
            }

            return response.json();
        })
        .then((data: Array<User>) => data);
};

export const getUserByIdAsync = async (id: string): Promise<User> => {
    const requestUrl = `${url}${id}`;

    return authFetch(requestUrl)
        .then((response) => response.json())
        .then((data: User) => data);
};

export const addUserAsync = async (user: User, file: File): Promise<User> => {
    const requestBody = new FormData();

    requestBody.append('firstName', user.firstName);
    requestBody.append('lastName', user.lastName);
    requestBody.append('email', user.email);
    requestBody.append('files', file);
    requestBody.append('roles', JSON.stringify(user.roles));
    requestBody.append('password', user.password);

    return authFetch(url, {
        method: FetchMethodsEnum.POST,
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
    requestBody.append('password', user.password);

    if (file) {
        requestBody.append('files', file);
    }

    const requestUrl = `${url}${user.id}`;

    return authFetch(requestUrl, {
        method: FetchMethodsEnum.PUT,
        body: requestBody,
    })
        .then((response) => response.json())
        .then((data: User) => data);
};

export const deleteUserAsync = async (user: User): Promise<User> => {
    const requestUrl = `${url}${user.id}`;

    return authFetch(requestUrl, {
        method: FetchMethodsEnum.DELETE,
    })
        .then((response) => response.json())
        .then((data: User) => data);
};
