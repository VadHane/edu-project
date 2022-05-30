import {User} from '../models/User';

const host: string = 'https://localhost:44303/';
const path: string = 'api/users/';

export const getAllUsersAsync = async (): Promise<Array<User>> => {
  const url = `${host}${path}`;

  return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data: Array<User>) => {
        return data;
      });
};

export const addUserAsync =async (user:User, file: any): Promise<number> => {
  const url = `${host}${path}`;

  const requestBody = new FormData();
  requestBody.append('firstName', user.firstName);
  requestBody.append('lastName', user.lastName);
  requestBody.append('email', user.email);
  requestBody.append('imageBlobKey', user.imageBlobKey);
  requestBody.append('roles', JSON.stringify(user.roles));
  requestBody.append('file', file);

  return fetch(url, {
    method: 'POST',
    body: requestBody})
      .then((response) => {
        return response.status;
      });
};
