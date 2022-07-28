import { User } from '../models/User';
import https from './../https';

const path = '/api/users/';

export const getAllUsersAsync = async (): Promise<Array<User>> => {
    return https.get<Array<User>>(path).then((response) => {
        if (response.status === 204) {
            return [];
        }

        return response.data;
    });
};

export const getUserByIdAsync = async (id: string): Promise<User> => {
    const requestUrl = `${path}${id}`;

    return https.get<User>(requestUrl).then((response) => response.data);
};

export const addUserAsync = async (user: User, file: File): Promise<User> => {
    const requestBody = new FormData();

    requestBody.append('firstName', user.firstName);
    requestBody.append('lastName', user.lastName);
    requestBody.append('email', user.email);
    requestBody.append('files', file);
    requestBody.append('roles', JSON.stringify(user.roles));
    requestBody.append('password', user.password);

    return https.post<User>(path, requestBody).then((response) => response.data);
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

    const requestUrl = `${path}${user.id}`;

    return https.put<User>(requestUrl, requestBody).then((response) => response.data);
};

export const deleteUserAsync = async (user: User): Promise<User> => {
    const requestUrl = `${path}${user.id}`;

    return https.delete<User>(requestUrl).then((response) => response.data);
};
