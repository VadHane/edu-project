import fs from 'fs';
import DataBase from '../models/File.js';
import path from 'path';
import Config from '../config.js';

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
     * Get all files from database as array of json objects. Async method.
     * 
     * @returns Array of json objects.
     * @returns Empty array, if database dont contains any file.
     */
    async getAll() {
        const documents = await DataBase.find();
        let files = [];

        for (let document of documents) {        
            files.push({
                id: document._id,
                contentType: document.metadata.contentType,
                createAt: document.createdAt,
                updateAt: document.updateAt
            });
        }
        
        return files;
    }

    /**
     * Get file from database by id. Async method.
     * 
     * @param {Number} id - Unique identifier of file.
     * 
     * @returns Json objects of photo from database.
     * @returns Null, if database dont contains file with id.
     * 
     * @throws {'Id is undefined or null!'} Argument id must be non-undefined and non-null.
     */
    async get(id) {
        if (!id) {
            throw Error('Id is undefined or null!');
        }

        const document = await DataBase.findById(id);

        if(!document) {
            return null;
        } else {
            return document.path;
        }
    }

    /**
     * The private method. Validate inputing file.
     * 
     * @param {*} file - The file for validating.
     * 
     * @throws Error 'File is undefined or null!'
     * @throws Error 'File doesn\'t contain needed fields!'
     * @throws Error 'File is not image!'
     */
    #validateFile(file) {
        if (!file){
            throw Error('File is undefined or null!');
        }

        if(!file.name || !file.mimetype || !file.encoding) {
            throw Error('File doesn\'t contain needed fields!');
        }

        const fileExtension = path.extname(file.name);
        const isPhoto = (fileExtension) => {
            const extensions = ['.png', '.jpeg', '.jpg'];
            let flag = false;

            extensions.forEach(element => {
                if (fileExtension === element) {
                    flag = true;
                }
            });

            return flag;
        };

        if (!isPhoto(fileExtension)) {
            throw Error('File is not image!');
        }
    }

    /**
     * Get absolute path for some file.
     * 
     * @param {String} fileName - The name of file.
     * 
     * @returns Absolute path for file.
     */
    #getFilePath(fileName) {
        const fileExtension = path.extname(fileName);

        const _fileName = Date.now() + fileExtension;
        return path.resolve('src', 'static', _fileName);
    }

    /**
     * Create new document about file in database. Async method.
     * 
     * @param {*} newFile - New file for adding in database.
     * 
     * @returns View of new file as json object from database.
     * 
     * @throws {'File is undefined or null!'} Argument newFile must be non-undefined and non-null.
     * @throws {'File doesn\'t contain needed fields!'} Argument newFile must contains next fields: name, mimetype, encoding.
     * @throws {'File is not image!'} Argument newFile must be image.
     */
    async create(newFile) {
        try {
            this.#validateFile(newFile);
        } catch (e) {
            throw Error(e.message);
        }

        const filePath = this.#getFilePath(newFile.name);
        newFile.mv(filePath);

        return await DataBase.create({
            path: filePath,
            metadata: {
                contentType: newFile.mimetype,
                contentEncoding: newFile.encoding,
                //CORS rules
                AccessControlAllowMethods: '*',
                AccessControlAllowHeaders: '*',
                AccessControlAllowOrigin: Config.AccessControlAllowOrigin,
            },
        });
    }

    /**
     * Find and replase file with id in database with updFile. Async method.
     * 
     * @param {Number} id - Unique identifier of file.
     * @param {File} updFile - The file for updating.
     * 
     * @returns View of updated file as json object from database.
     * 
     * @throws {'Id is undefined or null!'} Argument id must be non-undefined and non-null.
     * @throws {'File is undefined or null!'} Argument newFile must be non-undefined and non-null.
     * @throws {'File doesn\'t contain needed fields!'} Argument newFile must contains next fields: name, mimetype, encoding.
     * @throws {'File is not image!'} Argument newFile must be image.
     */
    async update(id, updFile) {
        if (!id) {
            throw Error('Id is undefined or null!');
        }

        try {
            this.#validateFile(updFile);
        } catch (e) {
            throw Error(e.message);
        }
        
        const document = await DataBase.findById(id);

        if(!document) {
            return null;
        }

        fs.unlink(document.path, (err) => {
            if(err){
                throw Error(err);
            }
        });

        const filePath = this.#getFilePath(updFile.name);
        updFile.mv(filePath);

        return await DataBase.findByIdAndUpdate(id, {
            path: filePath,
            metadata: {
                contentType: updFile.mimetype,
                contentEncoding: updFile.encoding,
            },
            updateAt: Date.now()
        });
    }

    /**
     * Find and delete file with id. Async method.
     * 
     * @param {*} id - Unique identifier of file.
     * @returns View of deleted file as json object from database.
     * 
     * @throws {'Id is undefined or null!'} Argument id must be non-undefined and non-null.
     */
    async delete(id) {
        if (!id) {
            throw Error('Id is undefined or null!');
        }

        const document = await DataBase.findByIdAndDelete(id);

        if(!document) {
            return null;
        }

        fs.unlink(document.path, (err) => {
            if(err){
                throw Error(err);
            }
        });
        
        return document;
    }
}
