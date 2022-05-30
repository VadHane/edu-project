import {Role} from '../models/Role';

const host: string = 'https://localhost:44303/';
const path: string = 'api/users/roles/';

export const getAllRolesAsync = async (): Promise<Array<Role>> => {
  const url = `${host}${path}`;

  return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data: Array<Role>) => {
        return data;
      });
};

export const createNewRole =async (role:Role): Promise<Role> => {
  const url = `${host}${path}`;
  const requestBody = new FormData();

  requestBody.append('name', `${role.name}`);
  debugger;
  return fetch(url, {
    method: 'POST',
    body: requestBody,
  })
      .then((response: Response) => response.json())
      .then((data: Role) => data);
};
