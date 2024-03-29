import fs from 'fs';
import DataBase from '../models/File.js';
import path from 'path';
import {
    ALLOWED_FILE_EXTENSIONS,
    ALLOWED_IMAGE_EXTENSIONS,
    BAD_FILE_EXTENSION_EXCEPTION,
    INCORRECT_FILE_EXCEPTION,
    INCORRECT_ID_EXCEPTION,
    NEEDED_FIELDS_ARE_MISSING_EXCEPTION,
} from '../constants.js';

/** Class for interaction with database. */
export default class FileService {
    /** Binding all methods. */
    constructor() {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    /**
     * Get all files from the database as an array of JSON objects. Async method.
     *
     * @returns Array of JSON objects.
     * @returns Empty array, if the database doesnt contain any file.
     */
    async getAll() {
        const documents = await DataBase.find();

        if (!documents) {
            return null;
        }

        const files = documents.map((document) => ({
            id: document._id,
            contentType: document.metadata.contentType,
            createAt: document.createdAt,
            updateAt: document.updateAt,
        }));

        return files;
    }

    /**
     * Get the path of the file from the database by id. Async method.
     *
     * @param {Number} id - Unique identifier of file.
     *
     * @returns JSON object of photo from the database.
     * @returns Null, if the database doesnt contain a file with id.
     *
     * @throws {'Id is undefined or null'} Argument id must be non-undefined and non-null.
     */
    async get(id) {
        if (!id) {
            throw Error(INCORRECT_ID_EXCEPTION);
        }

        const document = await DataBase.findById(id);
        if (!document) {
            return null;
        } else {
            return document.path;
        }
    }

    /**
     * The private method. Validate input file.
     *
     * @param {*} file - The file for validating.
     *
     * @throws Error 'File is undefined or null!'
     * @throws Error 'File doesn\'t contain needed fields!'
     * @throws Error 'File is not image!'
     */
    #validateFile(file) {
        if (!file) {
            throw Error(INCORRECT_FILE_EXCEPTION);
        }

        if (!file.name || !file.mimetype || !file.encoding) {
            throw Error(NEEDED_FIELDS_ARE_MISSING_EXCEPTION);
        }

        const fileExtension = path.extname(file.name);
        const isPhoto = ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension);
        const isCADFile = ALLOWED_FILE_EXTENSIONS.includes(fileExtension);

        if (!isPhoto && !isCADFile) {
            throw Error(BAD_FILE_EXTENSION_EXCEPTION);
        }
    }

    /**
     * Get absolute path for the file.
     *
     * @param {String} fileName - The name of file.
     *
     * @returns Absolute path for the file.
     */
    #generateFilePath(fileName) {
        const fileExtension = path.extname(fileName);
        const _fileName = Date.now() + fileExtension;
        const pathToStaticFolder = path.resolve('src', 'static');

        if (!fs.existsSync(pathToStaticFolder)) {
            fs.mkdirSync(pathToStaticFolder);
        }

        return path.resolve(pathToStaticFolder, _fileName);
    }

    /**
     * Create a new document about the file in the database. Async method.
     *
     * @param {*} newFile - New file for adding to the database.
     *
     * @returns View of new file as JSON object from the database.
     *
     * @throws {'File is undefined or null'} Argument newFile must be non-undefined and non-null.
     * @throws {'File doesn\'t contain needed fields'} Argument newFile must contains next fields: name, mimetype, encoding.
     * @throws {'File is not image'} Argument newFile must be image.
     */
    async create(newFile) {
        try {
            this.#validateFile(newFile);
        } catch (e) {
            throw Error(e.message);
        }

        const filePath = this.#generateFilePath(newFile.name);

        newFile.mv(filePath);

        return await DataBase.create({
            path: filePath,
            metadata: {
                contentType: newFile.mimetype,
                contentEncoding: newFile.encoding,
                //CORS rules
                AccessControlAllowMethods: '*',
                AccessControlAllowHeaders: '*',
                AccessControlAllowOrigin: '*',
            },
        });
    }

    /**
     * Find and replace the file with id in the database with updFile. Async method.
     *
     * @param {Number} id - Unique identifier of file.
     * @param {File} updFile - The file for updating.
     *
     * @returns View of the updated file as JSON object from the database.
     *
     * @throws {'Id is undefined or null'} Argument id must be non-undefined and non-null.
     * @throws {'File is undefined or null'} Argument newFile must be non-undefined and non-null.
     * @throws {'File doesn\'t contain needed fields'} Argument newFile must contains next fields: name, mimetype, encoding.
     * @throws {'File is not image'} Argument newFile must be image.
     */
    async update(id, updFile) {
        if (!id) {
            throw Error(INCORRECT_ID_EXCEPTION);
        }

        try {
            this.#validateFile(updFile);
        } catch (e) {
            throw Error(e.message);
        }

        const document = await DataBase.findById(id);

        if (!document) {
            return null;
        }

        fs.unlink(document.path, (err) => {
            if (err) {
                throw Error(err);
            }
        });

        const filePath = this.#generateFilePath(updFile.name);

        updFile.mv(filePath);

        return await DataBase.findByIdAndUpdate(id, {
            path: filePath,
            metadata: {
                contentType: updFile.mimetype,
                contentEncoding: updFile.encoding,
            },
            updateAt: Date.now(),
        });
    }

    /**
     * Find and delete the file with id. Async method.
     *
     * @param {*} id - Unique identifier of file.
     * @returns View of deleted file as JSON object from the database.
     *
     * @throws {'Id is undefined or null'} Argument id must be non-undefined and non-null.
     */
    async delete(id) {
        if (!id) {
            throw Error(INCORRECT_ID_EXCEPTION);
        }

        const document = await DataBase.findByIdAndDelete(id);

        if (!document) {
            return null;
        }

        fs.unlink(document.path, (err) => {
            if (err) {
                throw Error(err);
            }
        });

        return document;
    }
}
