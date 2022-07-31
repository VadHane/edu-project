import { Role } from '../models/Role';
import https from './../https';

const path = '/api/users/roles/';

export const getAllRolesAsync = async (): Promise<Array<Role>> => {
    return https.get<Array<Role>>(path).then((response) => response.data);
};

export const createNewRole = async (role: Role): Promise<Role> => {
    const requestBody = new FormData();

    requestBody.append('name', `${role.name}`);

    return https.post<Role>(path, requestBody).then((response) => response.data);
};
