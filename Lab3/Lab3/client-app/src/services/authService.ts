import { FORBIDDEN_EXCEPTION, UNAUTHORIZED_EXCEPTION } from '../exceptions';
import { User } from '../models/User';
import { SessionStorageFields } from '../types/App.types';
import { FetchMethodsEnum, FetchOptions } from '../types/Auth.types';
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

    localStorage.setItem(SessionStorageFields.ACCESS_TOKEN, accessToken);
    localStorage.setItem(SessionStorageFields.REFRESH_TOKEN, refreshToken);

    const user = await getUserByIdAsync(userId);

    user.isAdmin = user.roles.find((role) => role.isAdmin) ? true : false;

    return user;
};

export const authByAccessToken = async () => {
    const accessToken = localStorage.getItem(SessionStorageFields.ACCESS_TOKEN);
    const requestUrl = `${url}auth-by-token/`;
    const formData = new FormData();

    formData.append('accessToken', accessToken ?? '');

    const res = await authFetch(requestUrl, {
        method: FetchMethodsEnum.POST,
        body: formData,
    });

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

    localStorage.setItem(SessionStorageFields.ACCESS_TOKEN, accessToken);
    localStorage.setItem(SessionStorageFields.REFRESH_TOKEN, refreshToken);

    return createdUser;
};

export const refreshTokenAsync = async (): Promise<string> => {
    const requestUrl = `${url}refresh-token/`;
    const formData = new FormData();

    formData.append(
        'refreshToken',
        localStorage.getItem(SessionStorageFields.REFRESH_TOKEN) ?? '',
    );

    const res = await fetch(requestUrl, { method: 'POST', body: formData });

    if (res.status === 401) {
        throw new Error(UNAUTHORIZED_EXCEPTION);
    }

    const { accessToken } = await res.json();

    if (!accessToken) {
        throw Error();
    }

    localStorage.removeItem(SessionStorageFields.ACCESS_TOKEN);
    localStorage.setItem(SessionStorageFields.ACCESS_TOKEN, accessToken);

    return accessToken;
};

export const authFetch = async (
    url: string,
    options?: FetchOptions,
): Promise<Response> => {
    const accessToken = localStorage.getItem(SessionStorageFields.ACCESS_TOKEN);
    const authString = `Bearer ${accessToken}`;

    const response = await fetch(url, {
        ...options,
        headers: { Authorization: authString },
    })
        .then((res) => {
            if (res.status === 401) {
                return Promise.reject(res);
            }

            return res;
        })
        .catch(async (res: Response) => {
            if (res.status === 401) {
                return await refreshTokenAsync().then(async () => {
                    const authString = `Bearer ${localStorage.getItem(
                        SessionStorageFields.ACCESS_TOKEN,
                    )}`;

                    return await fetch(url, {
                        ...options,
                        headers: { Authorization: authString },
                    });
                });
            } else {
                return res;
            }
        });

    if (response.status === 401) {
        throw new Error(UNAUTHORIZED_EXCEPTION);
    }

    return response;
};
