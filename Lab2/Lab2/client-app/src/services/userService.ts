import {User} from '../models/User';

const host: string = 'https://localhost:44303/';
const path: string = 'api/users/';

export const getAllUsers = async (): Promise<Array<User>> => {
  const url = `${host}${path}`;

  return fetch(url).then((response) => {
    return response.json();
  }).then((data: Array<User>) => {
    return data;
  });
};
