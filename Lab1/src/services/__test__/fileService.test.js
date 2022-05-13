/* eslint-disable no-undef */
import FileService from '../fileService.js';
import db from '../../models/File.js';
import fs from 'fs';
import path from 'path';
import Config from '../../config.js';
const service = new FileService();

describe('Testing async method "getAll"', () => {
    let _;

    beforeAll(() => {
        db.find = jest.fn();
    });

    test('Returning the empty array if db is empty too.', async () => {
        _ = [];
        db.find.mockReturnValue(_);

        const data = await service.getAll();

        expect(data).toEqual(_);
    });

    test('Correctly returning data.', async () => {
        _ = [
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

        db.find.mockReturnValue(_);

        _ = [
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
        expect(data).toEqual(_);
    });
});

describe('Testing async method "get(id)"', () => {
    let _;

    beforeAll(() => {
        db.findById = jest.fn();
    });

    test('Throw error if id is undefined or null.', async () => {
        await expect(service.get()).rejects.toThrowError('Id is undefined or null!');
        await expect(service.get(null)).rejects.toThrowError('Id is undefined or null!');
    });

    test('Returning null if id is out of range.', async () => {
        db.findById.mockReturnValue(null);

        const data = await service.get(6); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        _ = {
            id: 3,
            path: 'testing\\path',
            contentType: 'json',
            createAt: 12,
            updateAt: 12
        };
        db.findById.mockReturnValue(_);

        const data = await service.get(3);

        expect(data).toBe('testing\\path');
    });
});

describe('Testing async method "create(new file)"', () => { 
    let _;
    beforeAll(() => {
        db.create = jest.fn(obj => obj);
    });

    beforeEach(() => {
        _ = {
            name: 'testName.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            mv: jest.fn()
        };
    });

    test('Throw error if new file is undefined or null.', async () => {
        await expect(service.create()).rejects.toThrowError('File is undefined or null!');
        await expect(service.create(null)).rejects.toThrowError('File is undefined or null!');
    });

    test('Throw error if new file is not image.', async () => {
        _.name = 'testName.txt';

        await expect(service.create(_)).rejects.toThrowError('File is not image!');
    });

    test('Throw erroe if new file doesn\'t contain needed fields: name, mimetype, encoding.', async () => {
        await expect(service.create({..._, mimetype: undefined})).rejects.toThrowError('File doesn\'t contain needed fields! (name, mimetype, encoding)');
        await expect(service.create({..._, name: undefined})).rejects.toThrowError('File doesn\'t contain needed fields! (name, mimetype, encoding)');
        await expect(service.create({..._, encoding: undefined})).rejects.toThrowError('File doesn\'t contain needed fields! (name, mimetype, encoding)');
    });

    test('Correctly returning data.', async () => {
        Date.now = jest.fn(() => 'test');

        const data = await service.create(_);

        expect(data).toEqual({
            path: path.resolve('src', 'static', 'test.jpg'),
            metadata: {
                contentType: 'image/jpeg',
                contentEncoding: '7bit',
                AccessControlAllowMethods: '*',
                AccessControlAllowHeaders: '*',
                AccessControlAllowOrigin: Config.AccessControlAllowOrigin
            }
        });
    });
});

describe('Testing async method "update(id)"', () => {
    let _;

    beforeEach(() => {
        _ = {
            name: 'testName.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            mv: jest.fn()
        };
    });

    test('Throw error if id is undefined or null.', async () => {
        await expect(service.update()).rejects.toThrowError('Id is undefined or null!');
        await expect(service.update(null)).rejects.toThrowError('Id is undefined or null!');
    });

    test('Throw erroe if new file doesn\'t contain needed fields: name, mimetype, encoding.', async () => {
        // 1 is random number
        await expect(service.update(1, {..._, mimetype: undefined})).rejects.toThrowError('File doesn\'t contain needed fields! (name, mimetype, encoding)');
        await expect(service.update(1, {..._, name: undefined})).rejects.toThrowError('File doesn\'t contain needed fields! (name, mimetype, encoding)');
        await expect(service.update(1, {..._, encoding: undefined})).rejects.toThrowError('File doesn\'t contain needed fields! (name, mimetype, encoding)');
    });

    test('Returning null if id is out of range.', async () => {
        db.findById.mockReturnValue(null);

        const data = await service.update(6, _); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        Date.now = jest.fn(() => 'test');
        fs.unlink = jest.fn();
        db.findByIdAndUpdate = jest.fn((id, obj) => obj);
        db.findById = jest.fn(() => 123); // 123 is random number

        const data = await service.update(1, _); // 1 is random number

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
        await expect(service.delete()).rejects.toThrowError('Id is undefined or null!');
        await expect(service.delete(null)).rejects.toThrowError('Id is undefined or null!');
    });

    test('Returning null if id is out of range.', async () => {
        db.findByIdAndDelete = jest.fn(() => null);

        const data = await service.delete(6); // database collection doesn`t contain object with id = 6

        expect(data).toBe(null);
    });

    test('Correctly returning data.', async () => {
        let _ = {
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
        db.findByIdAndDelete = jest.fn(() => _);

        const data = await service.delete(1); // 1 is random number

        expect(data).toEqual(_);
    });
});
