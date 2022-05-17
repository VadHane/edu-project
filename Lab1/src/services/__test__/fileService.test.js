/* eslint-disable no-undef */
import FileService from '../fileService.js';
import db from '../../models/File.js';
import fs from 'fs';
import path from 'path';
import { CORS_RES_HEADERS, FILE_NOT_IMAGE_EXCEPTION, INCORRECT_FILE_EXCEPTION, INCORRECT_ID_EXCEPTION, NEEDED_FIELDS_ARE_MISSING_EXCEPTION } from '../../constants.js';
const service = new FileService();

const testData = [
    {
        _id: 1,
        metadata: {
            contentType: 'json',
        },
        createdAt: 10,
        updateAt: 10
    },
    {
        _id: 2,
        metadata: {
            contentType: 'json',
        },
        createdAt: 11,
        updateAt: 11
    },
    {
        _id: 3,
        path: 'testing\\path',
        metadata: {
            contentType: 'json',
        },
        createdAt: 12,
        updateAt: 12
    },
];

const testFile = {
    name: 'testName.jpg',
    mimetype: 'image/jpeg',
    encoding: '7bit',
    mv: jest.fn()
};

describe('Testing async method "getAll"', () => {
    beforeAll(() => {
        db.find = jest.fn();
    });

    test('Returning the empty array if db is empty too.', async () => {
        db.find.mockReturnValue([]);

        const data = await service.getAll();

        expect(data.length).toBe(0);
    });

    test('Returning null if database is empty.', async () => {
        db.find.mockReturnValue(null);

        const data = await service.getAll(); // database collection doesn`t contain any object

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        db.find.mockReturnValue(testData);

        const expectedData = [
            {
                id: 1,
                contentType: 'json',
                createAt: 10,
                updateAt: 10
            },
            {
                id: 2,
                contentType: 'json',
                createAt: 11,
                updateAt: 11
            },
            {
                id: 3,
                contentType: 'json',
                createAt: 12,
                updateAt: 12
            },
        ];

        const data = await service.getAll();
        expect(data).toEqual(expectedData);
    });
});

describe('Testing async method "get(id)"', () => {
    beforeAll(() => {
        db.findById = jest.fn();
    });

    test('Throw error if id is undefined or null.', async () => {
        await expect(service.get()).rejects.toThrowError(INCORRECT_ID_EXCEPTION);
        await expect(service.get(null)).rejects.toThrowError(INCORRECT_ID_EXCEPTION);
    });

    test('Returning null if id is out of range.', async () => {
        db.findById.mockReturnValue(null);

        const data = await service.get(6); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        db.findById.mockReturnValue(testData[2]);

        const data = await service.get(3);

        expect(data).toBe(testData[2].path);
    });
});

describe('Testing async method "create(new file)"', () => { 
    beforeAll(() => {
        db.create = jest.fn(obj => obj);
    });

    test('Throw error if new file is undefined or null.', async () => {
        await expect(service.create()).rejects.toThrowError(INCORRECT_FILE_EXCEPTION);
        await expect(service.create(null)).rejects.toThrowError(INCORRECT_FILE_EXCEPTION);
    });

    test('Throw error if new file is not image.', async () => {
        await expect(service.create({...testFile, name: 'testName.txt'})).rejects.toThrowError(FILE_NOT_IMAGE_EXCEPTION);
    });

    test('Throw erroe if new file doesn\'t contain needed fields: name, mimetype, encoding.', async () => {
        await expect(service.create({...testFile, mimetype: undefined})).rejects.toThrowError(NEEDED_FIELDS_ARE_MISSING_EXCEPTION);
        await expect(service.create({...testFile, name: undefined})).rejects.toThrowError(NEEDED_FIELDS_ARE_MISSING_EXCEPTION);
        await expect(service.create({...testFile, encoding: undefined})).rejects.toThrowError(NEEDED_FIELDS_ARE_MISSING_EXCEPTION);
    });

    test('Correctly returning data.', async () => {
        Date.now = jest.fn(() => 'test');

        const data = await service.create(testFile);

        expect(data).toEqual({
            path: path.resolve('src', 'static', 'test.jpg'),
            metadata: {
                contentType: 'image/jpeg',
                contentEncoding: '7bit',
                AccessControlAllowMethods: '*',
                AccessControlAllowHeaders: '*',
                AccessControlAllowOrigin: CORS_RES_HEADERS.AccessControlAllowOrigin
            }
        });
    });
});

describe('Testing async method "update(id)"', () => {
    test('Throw error if id is undefined or null.', async () => {
        await expect(service.update()).rejects.toThrowError(INCORRECT_ID_EXCEPTION);
        await expect(service.update(null)).rejects.toThrowError(INCORRECT_ID_EXCEPTION);
    });

    test('Throw erroe if new file doesn\'t contain needed fields: name, mimetype, encoding.', async () => {
        // 1 is random number
        await expect(service.update(1, {...testFile, mimetype: undefined})).rejects.toThrowError(NEEDED_FIELDS_ARE_MISSING_EXCEPTION);
        await expect(service.update(1, {...testFile, name: undefined})).rejects.toThrowError(NEEDED_FIELDS_ARE_MISSING_EXCEPTION);
        await expect(service.update(1, {...testFile, encoding: undefined})).rejects.toThrowError(NEEDED_FIELDS_ARE_MISSING_EXCEPTION);
    });

    test('Returning null if id is out of range.', async () => {
        db.findById.mockReturnValue(null);

        const data = await service.update(6, testFile); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        Date.now = jest.fn(() => 'test');
        fs.unlink = jest.fn();
        db.findByIdAndUpdate = jest.fn((id, obj) => obj);
        db.findById = jest.fn(() => 123); // 123 is random number

        const data = await service.update(1, testFile); // 1 is random number

        expect(data).toEqual({
            path: path.resolve('src', 'static', 'test.jpg'),
            metadata: {
                contentType: 'image/jpeg',
                contentEncoding: '7bit',
            },
            updateAt: 'test'
        });
    });
});

describe('Testing async method "update(id)"', () => {
    test('Throw error if id is undefined or null.', async () => {
        await expect(service.delete()).rejects.toThrowError(INCORRECT_ID_EXCEPTION);
        await expect(service.delete(null)).rejects.toThrowError(INCORRECT_ID_EXCEPTION);
    });

    test('Returning null if id is out of range.', async () => {
        db.findByIdAndDelete = jest.fn(() => null);

        const data = await service.delete(6); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        const expectedData = {
            path: path.resolve('src', 'static', 'test.jpg'),
            metadata: {
                contentType: 'image/jpeg',
                contentEncoding: '7bit',
                AccessControlAllowMethods: '*',
                AccessControlAllowHeaders: '*',
                AccessControlAllowOrigin: '*'
            },
            createdAt: '1',
            updateAt: '1'
        };

        fs.unlink = jest.fn();
        db.findByIdAndDelete = jest.fn(() => expectedData);

        const data = await service.delete(1); // 1 is random number

        expect(data).toEqual(expectedData);
    });
});
