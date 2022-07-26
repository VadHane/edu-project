import { FORBIDDEN_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exceptions';
import { User } from '../models/User';
import { SessionStorageFields } from '../types/App.types';
import { addUserAsync, getUserByIdAsync } from './userService';

const url = `${process.env.REACT_APP_HOST_URL}/api/auth/`;

export const authorizationUserAsync = async (
    email: string,
    password: string,
): Promise<User> => {
    const formData = new FormData();
    const requestUrl = `${url}get-token/`;

    formData.append('email', email);
    formData.append('password', password);

    const res = await fetch(requestUrl, {
        method: 'POST',
        body: formData,
    });
    const { userId, accessToken, refreshToken } = await res.json();

    if (!userId || !accessToken || !refreshToken) {
        throw Error();
    }

    const user = await getUserByIdAsync(userId);

    sessionStorage.setItem(SessionStorageFields.ACCESS_TOKEN, accessToken);
    sessionStorage.setItem(SessionStorageFields.REFRESH_TOKEN, refreshToken);

    user.isAdmin = user.roles.find((role) => role.isAdmin) ? true : false;

    return user;
};

export const authByAccessToken = async () => {
    const accessToken = sessionStorage.getItem(SessionStorageFields.ACCESS_TOKEN);
    const authString = `Bearer ${accessToken}`;

    if (!accessToken) {
        throw new Error();
    }

    const requestUrl = `${url}auth-by-token/`;
    const formData = new FormData();

    formData.append('accessToken', accessToken);

    const res = await fetch(requestUrl, {
        method: 'POST',
        body: formData,
        headers: { Authorization: authString },
    });

    if (res.status === 403) {
        throw new Error(FORBIDDEN_EXCEPTION);
    } else if (res.status === 401) {
        throw new Error(UNAUTHORIZED_EXCEPTION);
    }

    const user: User = await res.json();

    user.isAdmin = user.roles.find((role) => role.isAdmin) ? true : false;

    return user;
};

export const registrationUserAsync = async (user: User, file: File) => {
    const requestUrl = `${url}get-token/`;
    const createdUser = await addUserAsync(user, file);
    const formData = new FormData();

    formData.append('email', user.email);
    formData.append('password', user.password);

    const res = await fetch(requestUrl, { method: 'POST', body: formData });
    const { userId, accessToken, refreshToken } = await res.json();

    if (!userId || !accessToken || !refreshToken) {
        throw Error();
    }

    sessionStorage.setItem(SessionStorageFields.ACCESS_TOKEN, accessToken);
    sessionStorage.setItem(SessionStorageFields.REFRESH_TOKEN, refreshToken);

    return createdUser;
};

export const refreshTokenAsync = async () => {
    const requestUrl = `${url}refresh-token/`;
    const formData = new FormData();

    formData.append(
        'refreshToken',
        sessionStorage.getItem(SessionStorageFields.REFRESH_TOKEN) ?? '',
    );

    const res = await fetch(requestUrl, { method: 'POST', body: formData });

    if (res.status === 403) {
        throw new Error(FORBIDDEN_EXCEPTION);
    }

    const { userId, accessToken, refreshToken } = await res.json();

    if (!userId || !accessToken || !refreshToken) {
        throw Error();
    }

    const user = await getUserByIdAsync(userId);

    sessionStorage.setItem(SessionStorageFields.ACCESS_TOKEN, accessToken);
    sessionStorage.setItem(SessionStorageFields.REFRESH_TOKEN, refreshToken);

    return user;
};
