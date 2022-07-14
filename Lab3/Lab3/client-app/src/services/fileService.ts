const url = `${process.env.REACT_APP_FILE_STORAGE_URL}/api/file/`;

export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();

    formData.append('file', file);

    return fetch(url, {
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
    const formData = new FormData();

    formData.append('file', newFile);

    const requestUrl = `${url}${fileBlobKey}`;

    return fetch(requestUrl, {
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

    return fetch(requestUrl, { method: 'DELETE' }).then((res) => {
        if (res.status !== 200) {
            return false;
        }

        return true;
    });
};
