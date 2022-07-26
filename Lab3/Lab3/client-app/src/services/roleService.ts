import { Role } from '../models/Role';
import { FetchMethodsEnum } from '../types/Auth.types';
import { authFetch } from './authService';

const url = `${process.env.REACT_APP_HOST_URL}/api/users/roles/`;

export const getAllRolesAsync = async (): Promise<Array<Role>> => {
    return authFetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data: Array<Role>) => {
            return data;
        });
};

export const createNewRole = async (role: Role): Promise<Role> => {
    const requestBody = new FormData();

    requestBody.append('name', `${role.name}`);

    return authFetch(url, {
        method: FetchMethodsEnum.POST,
        body: requestBody,
    })
        .then((response: Response) => response.json())
        .then((data: Role) => data);
};
