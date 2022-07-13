import {
    FILE_WAS_NOT_FOUND_TEXT,
    FILES_WERE_NOT_FOUND_TEXT,
} from '../constants.js';
import FileService from '../services/fileService.js';

/** Class with endpoints for API router. */
export default class FileController {
    /** They are binding all methods and create a new object (fileServise) to work with the database. */
    constructor() {
        this.getAllFiles = this.getAllFiles.bind(this);
        this.getFile = this.getFile.bind(this);
        this.createFile = this.createFile.bind(this);
        this.updateFile = this.updateFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.fileService = new FileService();
    }

    /**
     * Get all files as an array of JSON objects.
     *
     * @param {Request} req - The request that the user sends to API.
     * @param {Response} res - The response that API sends to the user.
     *
     * @returns Status code 200 and an array of JSON objects of photo from the database.
     * @returns Status code 404 and JSON string - 'Files was not found', if the database doesnt contain any file.
     * @returns Status code 500, if there was an exception.
     */
    async getAllFiles(req, res) {
        try {
            const files = await this.fileService.getAll();

            if (!files) {
                res.status(204).send(FILES_WERE_NOT_FOUND_TEXT).end();
            } else {
                res.status(200).send(files).end();
            }
        } catch (e) {
            res.status(500).end();
        }
    }

    /**
     * Get file by id.
     *
     * @param {Request} req - The request that the user sends to API.
     * @param {Response} res - The response that API sends to the user.
     *
     * @returns Status code 200 and JSON objects of photo from the database.
     * @returns Status code 404 and JSON string - 'Files was not found', if the database doesnt contain a file with id from request.params.id
     * @returns Status code 500, if there was an exception.
     */
    async getFile(req, res) {
        try {
            const filePath = await this.fileService.get(req.params.id);

            if (!filePath) {
                res.status(404).json(FILE_WAS_NOT_FOUND_TEXT).end();
                return;
            }

            res.status(200).sendFile(filePath);
        } catch (e) {
            res.status(500).end();
        }
    }

    /**
     * Create and save in database new file from request.files.
     *
     * @param {Request} req - The request that the user sends to API.
     * @param {Response} res - The response that API sends to the user.
     *
     * @returns Status code 200 and view of new file as JSON object from the database.
     * @returns Status code 500, if there was an exception.
     */
    async createFile(req, res) {
        try {
            const document = await this.fileService.create(req.files?.file);

            res.status(201).json(document).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    }

    /**
     * Find and replace the file from the database with id = request.params.id with a new file from request.files.
     *
     * @param {Request} req - The request that the user sends to API.
     * @param {Response} res - The response that API sends to the user.
     *
     * @returns Status code 200 and view of the updated file as a JSON object from the database.
     * @returns Status code 404 and JSON string - 'Files was not found'.
     * @returns Status code 500, if there was some exception.
     */
    async updateFile(req, res) {
        try {
            const document = await this.fileService.update(
                req.params.id,
                req.files?.file
            );

            if (!document) {
                res.status(404).json(FILE_WAS_NOT_FOUND_TEXT).end();
            } else {
                res.status(200).json(document).end();
            }
        } catch (e) {
            res.status(500).end();
        }
    }

    /**
     * Find and delete file with id = request.params.id from database.
     *
     * @param {Request} req - The request that the user sends to API.
     * @param {Response} res - The response that API sends to the user.
     *
     * @returns Status code 200 and view of deleted file as a JSON object from the database.
     * @returns Status code 500, if there was some exception.
     */
    async deleteFile(req, res) {
        try {
            const document = await this.fileService.delete(req.params.id);

            if (!document) {
                res.status(404).json(FILE_WAS_NOT_FOUND_TEXT).end();
            } else {
                res.status(200).json(document).end();
            }
        } catch (e) {
            res.status(500).end();
        }
    }
}
