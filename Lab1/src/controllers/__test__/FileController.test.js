import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { CORS_RES_HEADERS } from './../../constants.js';
import file from './../../routes/fileRoutes.js';
import path from 'path';
import { FILE_WAS_NOT_FOUND_TEXT } from './../../constants.js';

const mockedGetAll = jest.fn();
const mockedGet = jest.fn();
const mockedCreate = jest.fn();
const mockedUpdate = jest.fn();
const mockedDelete = jest.fn();

jest.mock('./../../services/fileService.js', () =>
    jest.fn().mockImplementation(() => {
        return {
            getAll: () => mockedGetAll(),
            get: () => mockedGet(),
            create: () => mockedCreate(),
            update: () => mockedUpdate(),
            delete: () => mockedDelete(),
        };
    })
);

const url = '/api/file/';

const app = express();

app.use(
    cors({
        origin: CORS_RES_HEADERS['Access-Control-Allow-Origin'],
    })
);
app.use('/api/file', file);

describe('API tests for file controller.', () => {
    test('Get endpoint (~/api/file/) should return all files entity and 200 status code.', async () => {
        const expectValue = [
            {
                _id: 'test',
                contentType: 'test',
                createdAt: 'test',
                updateAt: 'test',
            },
        ];

        mockedGetAll.mockReturnValue(expectValue);

        const response = await request(app).get(url);

        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
        expect(response.body._id).toEqual(expectValue._id);
    });

    test('Get endpoint (~/api/file/) should return 204 status code if database is empty.', async () => {
        mockedGetAll.mockReturnValue(null);

        await request(app).get('/api/file/').expect(204);
    });

    test('Get endpoint (~/api/file/:id) should return 404 status code if DB dont consist file with this id.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;

        mockedGet.mockReturnValue(null);

        const response = await request(app).get(requestPath);

        expect(response.status).toEqual(404);
        expect(response.body).toEqual(FILE_WAS_NOT_FOUND_TEXT);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
    });

    test('Get endpoint (~/api/file/:id) should return 200 status code and image.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;
        const testPhotoDirectory = path.resolve(
            'src',
            'controllers',
            '__test__',
            'image'
        );
        const testPhotoName = 'testPhoto.png';
        const testPhotoPath = path.resolve(testPhotoDirectory, testPhotoName);

        mockedGet.mockReturnValue(testPhotoPath);

        const response = await request(app).get(requestPath);

        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/image/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
    });

    test('Post endpoint (~/api/file/) should return 500 status code if request dont includes the file.', async () => {
        mockedCreate.mockImplementation(() => {
            throw Error();
        });

        const response = await request(app).post(url);

        expect(response.status).toEqual(500);
    });

    test('Post endpoint (~/api/file/) should create and return a new entity of file.', async () => {
        const expectValue = {
            _id: 'test',
            contentType: 'test',
            createdAt: 'test',
            updateAt: 'test',
        };

        mockedCreate.mockReturnValue(expectValue);

        const response = await request(app).post(url);

        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
        expect(response.body._id).toEqual(expectValue._id);
    });

    test('Put endpoint (~/api/file/:id) should return 404 status code if DB dont consist file with this id.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;

        mockedUpdate.mockReturnValue(null);

        const response = await request(app).put(requestPath);

        expect(response.status).toEqual(404);
        expect(response.body).toEqual(FILE_WAS_NOT_FOUND_TEXT);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
    });

    test('Put endpoint ~/api/file/:id) should update and return a updated entity of file.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;
        const expectValue = {
            _id: 'test',
            contentType: 'test',
            createdAt: 'test',
            updateAt: 'test',
        };

        mockedUpdate.mockReturnValue(expectValue);

        const response = await request(app).put(requestPath);

        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
        expect(response.body._id).toEqual(expectValue._id);
    });

    test('Delete endpoint (~/api/file/:id) should return 404 status code if DB dont consist file with this id.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;

        mockedDelete.mockReturnValue(null);

        const response = await request(app).delete(requestPath);

        expect(response.status).toEqual(404);
        expect(response.body).toEqual(FILE_WAS_NOT_FOUND_TEXT);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
    });

    test('Delete endpoint ~/api/file/:id) should delete and return a delete entity of file.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;
        const expectValue = {
            _id: 'test',
            contentType: 'test',
            createdAt: 'test',
            updateAt: 'test',
        };

        mockedDelete.mockReturnValue(expectValue);

        const response = await request(app).delete(requestPath);

        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
        expect(response.body._id).toEqual(expectValue._id);
    });
});
