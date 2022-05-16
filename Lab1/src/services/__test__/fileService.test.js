/* eslint-disable no-undef */
import FileService from '../fileService.js';
import db from '../../models/File.js';
import fs from 'fs';
import path from 'path';
import {Exceptions, resHeaders} from '../../config.js';
const service = new FileService();

describe('Testing async method "getAll"', () => {
    beforeAll(() => {
        db.find = jest.fn();
    });

    test('Returning the empty array if db is empty too.', async () => {
        const testData = [];
        db.find.mockReturnValue(testData);

        const data = await service.getAll();

        expect(data).toEqual(testData);
    });

    test('Returning null if database is empty.', async () => {
        db.find.mockReturnValue(null);

        const data = await service.getAll(); // database collection doesn`t contain any object

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        let testData = [
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
                metadata: {
                    contentType: 'json',
                },
                createdAt: 12,
                updateAt: 12
            },
        ];

        db.find.mockReturnValue(testData);

        testData = [
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
        expect(data).toEqual(testData);
    });
});

describe('Testing async method "get(id)"', () => {
    beforeAll(() => {
        db.findById = jest.fn();
    });

    test('Throw error if id is undefined or null.', async () => {
        await expect(service.get()).rejects.toThrowError(Exceptions.incorrectId);
        await expect(service.get(null)).rejects.toThrowError(Exceptions.incorrectId);
    });

    test('Returning null if id is out of range.', async () => {
        db.findById.mockReturnValue(null);

        const data = await service.get(6); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        const testData = {
            id: 3,
            path: 'testing\\path',
            contentType: 'json',
            createAt: 12,
            updateAt: 12
        };
        db.findById.mockReturnValue(testData);

        const data = await service.get(3);

        expect(data).toBe('testing\\path');
    });
});

describe('Testing async method "create(new file)"', () => { 
    let testData;

    beforeAll(() => {
        db.create = jest.fn(obj => obj);
    });

    beforeEach(() => {
        testData = {
            name: 'testName.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            mv: jest.fn()
        };
    });

    test('Throw error if new file is undefined or null.', async () => {
        await expect(service.create()).rejects.toThrowError(Exceptions.incorrectFile);
        await expect(service.create(null)).rejects.toThrowError(Exceptions.incorrectFile);
    });

    test('Throw error if new file is not image.', async () => {
        testData.name = 'testName.txt';

        await expect(service.create(testData)).rejects.toThrowError(Exceptions.fileNotImage);
    });

    test('Throw erroe if new file doesn\'t contain needed fields: name, mimetype, encoding.', async () => {
        await expect(service.create({...testData, mimetype: undefined})).rejects.toThrowError(Exceptions.neededFieldsAreMissing);
        await expect(service.create({...testData, name: undefined})).rejects.toThrowError(Exceptions.neededFieldsAreMissing);
        await expect(service.create({...testData, encoding: undefined})).rejects.toThrowError(Exceptions.neededFieldsAreMissing);
    });

    test('Correctly returning data.', async () => {
        Date.now = jest.fn(() => 'test');

        const data = await service.create(testData);

        expect(data).toEqual({
            path: path.resolve('src', 'static', 'test.jpg'),
            metadata: {
                contentType: 'image/jpeg',
                contentEncoding: '7bit',
                AccessControlAllowMethods: '*',
                AccessControlAllowHeaders: '*',
                AccessControlAllowOrigin: resHeaders.AccessControlAllowOrigin
            }
        });
    });
});

describe('Testing async method "update(id)"', () => {
    let testData;

    beforeEach(() => {
        testData = {
            name: 'testName.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            mv: jest.fn()
        };
    });

    test('Throw error if id is undefined or null.', async () => {
        await expect(service.update()).rejects.toThrowError(Exceptions.incorrectId);
        await expect(service.update(null)).rejects.toThrowError(Exceptions.incorrectId);
    });

    test('Throw erroe if new file doesn\'t contain needed fields: name, mimetype, encoding.', async () => {
        // 1 is random number
        await expect(service.update(1, {...testData, mimetype: undefined})).rejects.toThrowError(Exceptions.neededFieldsAreMissing);
        await expect(service.update(1, {...testData, name: undefined})).rejects.toThrowError(Exceptions.neededFieldsAreMissing);
        await expect(service.update(1, {...testData, encoding: undefined})).rejects.toThrowError(Exceptions.neededFieldsAreMissing);
    });

    test('Returning null if id is out of range.', async () => {
        db.findById.mockReturnValue(null);

        const data = await service.update(6, testData); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        Date.now = jest.fn(() => 'test');
        fs.unlink = jest.fn();
        db.findByIdAndUpdate = jest.fn((id, obj) => obj);
        db.findById = jest.fn(() => 123); // 123 is random number

        const data = await service.update(1, testData); // 1 is random number

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
        await expect(service.delete()).rejects.toThrowError(Exceptions.incorrectId);
        await expect(service.delete(null)).rejects.toThrowError(Exceptions.incorrectId);
    });

    test('Returning null if id is out of range.', async () => {
        db.findByIdAndDelete = jest.fn(() => null);

        const data = await service.delete(6); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        const testData = {
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
        db.findByIdAndDelete = jest.fn(() => testData);

        const data = await service.delete(1); // 1 is random number

        expect(data).toEqual(testData);
    });
});
