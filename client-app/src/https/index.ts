import axios, { AxiosRequestHeaders } from 'axios';
import { UNAUTHORIZED_EXCEPTION } from '../exceptions';
import { refreshTokenAsync } from '../services/authService';
import { LocalStorageFields } from '../types/App.types';

const API_URL = process.env.REACT_APP_HOST_URL;

const authAxios = axios.create({
    baseURL: API_URL,
});

authAxios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(LocalStorageFields.ACCESS_TOKEN);
    const authString = `Bearer ${accessToken}`;

    if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
    }

    config.headers['Authorization'] = authString;

    return config;
});

authAxios.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originRequest = error.config;

        if (error.response.status == 401) {
            const accessToken = await refreshTokenAsync();

            if (!accessToken) {
                throw new Error(UNAUTHORIZED_EXCEPTION);
            }

            return authAxios.request(originRequest);
        }
    },
);

export default authAxios;
