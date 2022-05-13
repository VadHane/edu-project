import FileService from '../services/fileService.js';

export default class FileController { 
    constructor() { 
        this.getAllFiles = this.getAllFiles.bind(this);
        this.getFile = this.getFile.bind(this);
        this.createFile = this.createFile.bind(this); 
        this.updateFile = this.updateFile.bind(this); 
        this.deleteFile = this.deleteFile.bind(this);
        this.fileService = new FileService();
    } 

    getAllFiles(req, res) {
        res.status(200).json('Get all file');
    } 

    getFile(req, res) { 
        res.status(200).json(`Get file (id = ${req.params.id})`);
    } 

    async createFile(req, res) {
        try {
            const document = await this.fileService.create(req.files.file);
            res.status(200).json(document); 
        } catch(e) {
            console.log(e);
            res.status(500);
        }
    } 

    async updateFile(req, res) {
        try {
            const document = await this.fileService.update(req.params.id, req.files.file);
            res.status(200).json(document);
        } catch(e) {
            console.log(e);
            res.status(500);
        }
    } 

    deleteFile(req, res) { 
        res.status(200).json(`Delete file (id = ${req.params.id})`);
    } 
}
