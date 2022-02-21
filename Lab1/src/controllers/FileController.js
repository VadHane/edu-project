export default class FileController { 
    constructor() { 
        this.getAllFiles = this.getAllFiles.bind(this);
        this.getFile = this.getFile.bind(this);
        this.createFile = this.createFile.bind(this); 
        this.updateFile = this.updateFile.bind(this); 
        this.deleteFile = this.deleteFile.bind(this);
    } 

    getAllFiles(req, res) { 
        res.status(200).json('Get all file');
    } 

    getFile(req, res) { 
        res.status(200).json(`Get file (id = ${req.params.id})`);
    } 

    createFile(req, res) { 
        res.status(200).json('Add some file'); 
    } 

    updateFile(req, res) { 
        res.status(200).json(`Update file (id = ${req.params.id})`);
    } 

    deleteFile(req, res) { 
        res.status(200).json(`Delete file (id = ${req.params.id})`);
    } 
}
