import { FetchMethodsEnum } from '../types/Auth.types';
import { authFetch } from './authService';

const url = `${process.env.REACT_APP_FILE_STORAGE_URL}/api/file/`;

export const signUrl = async (url: string): Promise<string> => {
    const serverUrl = `${process.env.REACT_APP_HOST_URL}/api/auth/sign-file-storage-url`;

    const formData = new FormData();

    formData.append('url', url);

    const res = await authFetch(serverUrl, {
        method: FetchMethodsEnum.POST,
        body: formData,
    });
    const signedUrl = (await res.json()) as string;

    return signedUrl;
};

export const uploadFile = async (file: File): Promise<string> => {
    const signedUrl = await signUrl(url);
    const formData = new FormData();

    formData.append('file', file);

    return fetch(signedUrl, {
        method: 'POST',
        body: formData,
    })
        .then((res) => {
            if (res.status !== 201) {
                throw new Error();
            }

            return res.json();
        })
        .then(({ _id }) => _id);
};

export const updateUploadedFile = async (
    fileBlobKey: string,
    newFile: File,
): Promise<string> => {
    const requestUrl = `${url}${fileBlobKey}`;
    const signedUrl = await signUrl(requestUrl);
    const formData = new FormData();

    formData.append('file', newFile);

    return fetch(signedUrl, {
        method: 'PUT',
        body: formData,
    })
        .then((res) => {
            if (res.status !== 200) {
                throw new Error();
            }

            return res.json();
        })
        .then(({ _id }) => _id);
};

export const deleteUploadedFile = async (fileBlobKey: string): Promise<boolean> => {
    const requestUrl = `${url}${fileBlobKey}`;
    const signedUrl = await signUrl(requestUrl);

    return fetch(signedUrl, { method: 'DELETE' }).then((res) => {
        if (res.status !== 200) {
            return false;
        }

        return true;
    });
};
