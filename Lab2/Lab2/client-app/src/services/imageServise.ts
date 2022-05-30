const host: string = 'https://localhost:3001/';
const path: string = 'api/file/';

export const postImageAsync = async (image: any): Promise<string> => {
  const url = `${host}${path}`;
  const data = new FormData();
  data.append('file', image);

  return fetch(url, {
    method: 'POST',
    body: data,
  }).then((response) => {
    return response.json();
  }).then((data: {id: string}) => {
    return `${url}${data.id}`;
  });
};

export const deleteImageAsync =
async (imageBlobKey: string): Promise<number> => {
  return fetch(imageBlobKey, {
    method: 'DELETE',
  }).then((response) => {
    return response.status;
  });
};
