import request from 'supertest';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { FILE_WAS_NOT_FOUND_TEXT } from './../../constants.js';
import FileController from '../FileController';

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

app.use(cors());
const controller = new FileController();

app.get('/api/file/', controller.getAllFiles);

app.get('/api/file/:id', controller.getFile);

app.post('/api/file/', controller.createFile);

app.put('/api/file/:id', controller.updateFile);

app.delete('/api/file/:id', controller.deleteFile);

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
        expect(response.body._id).toEqual(expectValue._id);
    });

    test('Get endpoint (~/api/file/) should return 204 status code if the database is empty.', async () => {
        mockedGetAll.mockReturnValue(null);

        await request(app).get('/api/file/').expect(204);
    });

    test('Get endpoint (~/api/file/:id) should return a 404 status code if DB dont consist file with this id.', async () => {
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

    test('Post endpoint (~/api/file/) should return a 500 status code if the request doesnt include the file.', async () => {
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

        expect(response.status).toEqual(201);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
        expect(response.body._id).toEqual(expectValue._id);
    });

    test('Put endpoint (~/api/file/:id) should return a 404 status code if DB doesnt consist file with this id.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;

        mockedUpdate.mockReturnValue(null);

        const response = await request(app).put(requestPath);

        expect(response.status).toEqual(404);
        expect(response.body).toEqual(FILE_WAS_NOT_FOUND_TEXT);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
    });

    test('Put endpoint ~/api/file/:id) should update and return an updated entity of the file.', async () => {
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

    test('Delete endpoint (~/api/file/:id) should return a 404 status code if DB doesnt consist file with this id.', async () => {
        const testFileId = 'test';
        const requestPath = `${url}${testFileId}`;

        mockedDelete.mockReturnValue(null);

        const response = await request(app).delete(requestPath);

        expect(response.status).toEqual(404);
        expect(response.body).toEqual(FILE_WAS_NOT_FOUND_TEXT);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.headers['access-control-allow-origin']).toMatch('*');
    });

    test('Delete endpoint ~/api/file/:id) should delete and return a deleted entity of the file.', async () => {
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
