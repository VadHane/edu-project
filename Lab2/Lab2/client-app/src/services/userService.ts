import {User} from '../models/User';

const path: string = 'users/';

export const getAllUsersAsync = async (): Promise<Array<User>> => {
  const url = `${process.env.REACT_APP_API_URL}${path}`;
  console.log(process.env.REACT_APP_API_URL);
  return fetch(url)
      .then((response) => response.json())
      .then((data: Array<User>) => data);
};

export const addUserAsync =async (user:User, file: any): Promise<User> => {
  const url = `${process.env.REACT_APP_API_URL}${path}`;

  const requestBody = new FormData();

  requestBody.append('firstName', user.firstName);
  requestBody.append('lastName', user.lastName);
  requestBody.append('email', user.email);
  requestBody.append('files', file);
  requestBody.append('roles', JSON.stringify(user.roles));

  return fetch(url, {
    method: 'POST',
    body: requestBody})
      .then((response) => response.json())
      .then((data: User) => data);
};
