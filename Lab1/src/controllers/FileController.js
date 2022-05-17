import {CORS_RES_HEADERS, FILE_WAS_NOT_FOUND_TEXT, FILES_WERE_NOT_FOUND_TEXT} from '../constants.js';
import FileService from '../services/fileService.js';

/** Class with endpoints for API router. */
export default class FileController {
    /** Binding all methods and creating new object (fileServise) to working with database. */ 
    constructor() { 
        this.getAllFiles = this.getAllFiles.bind(this);
        this.getFile = this.getFile.bind(this);
        this.createFile = this.createFile.bind(this); 
        this.updateFile = this.updateFile.bind(this); 
        this.deleteFile = this.deleteFile.bind(this);
        this.fileService = new FileService();
    } 

    /**
     * Get all files as array of json objects.
     * 
     * @param {Request} req - The request that user send to API.
     * @param {Response} res - The response that API send to user.
     * 
     * @returns Status code 200 and array of json objects of photo from database.
     * @returns Status code 404 and json string - 'Files was not found', if database dont contains any file.
     * @returns Status code 500, if there was exception.
     */
    async getAllFiles(req, res) {
        try {
            const files = await this.fileService.getAll();

            res.set(CORS_RES_HEADERS);

            if(!files) {
                res.status(404).send(FILES_WERE_NOT_FOUND_TEXT).end();
            } else {
                res.status(200).send(files).end();
            }
        } catch(e) {
            res.status(500).end();
        }
    } 

    /**
     * Get file by id.
     * 
     * @param {Request} req - The request that user send to API.
     * @param {Response} res - The response that API send to user.
     * 
     * @returns Status code 200 and json objects of photo from database.
     * @returns Status code 404 and json string - 'Files was not found', if database dont contains file with id from request.params.id
     * @returns Status code 500, if there was exception.
     */
    async getFile(req, res) { 
        try {
            const filePath = await this.fileService.get(req.params.id);

            res.set({
                ...CORS_RES_HEADERS,
                'Content-Type': 'image/jpeg'
            });

            if(!filePath) {
                res.status(404).json(FILE_WAS_NOT_FOUND_TEXT);
                return;
            }

            res.status(200).sendFile(filePath).end(); 
        } catch(e) {
            res.status(500).end();
        }
    } 

    /**
     * Create and safe in database new file from request.files.
     * 
     * @param {Request} req - The request that user send to API.
     * @param {Response} res - The response that API send to user.
     * 
     * @returns Status code 200 and view of new file as json object from database.
     * @returns Status code 500, if there was exception.
     */
    async createFile(req, res) {
        try {
            const document = await this.fileService.create(req.files.file);

            res.set(CORS_RES_HEADERS);

            res.status(200).json(document).end(); 
        } catch(e) {
            res.status(500).end();
        }
    } 

    /**
     * Find and replase file from database with id = request.params.id with new file from request.files.
     * 
     * @param {Request} req - The request that user send to API.
     * @param {Response} res - The response that API send to user.
     * 
     * @returns Status code 200 and view of updated file as json object from database.
     * @returns Status code 404 and json string - 'Files was not found'.
     * @returns Status code 500, if there is some exeption.
     */
    async updateFile(req, res) {
        try {
            const document = await this.fileService.update(req.params.id, req.files.file);

            res.set(CORS_RES_HEADERS);

            if(!document) {
                res.status(404).json(FILE_WAS_NOT_FOUND_TEXT).end();
            } else {
                res.status(200).json(document).end();
            }
        } catch(e) {
            res.status(500).end();
        }
    } 

    /**
     * Find and delete file with id = request.params.id from database.
     * 
     * @param {Request} req - The request that user send to API.
     * @param {Response} res - The response that API send to user.
     * 
     * @returns Status code 200 and view of deleted file as json object from database.
     * @returns Status code 500, if there is some exeption.
     */
    async deleteFile(req, res) { 
        try {
            const document = await this.fileService.delete(req.params.id);

            res.set(CORS_RES_HEADERS);

            if(!document) {
                res.status(404).json(FILE_WAS_NOT_FOUND_TEXT).end();
            } else {
                res.status(200).json(document).end();
            }
        } catch (e) {
            res.status(500).end();
        }
    } 
}
