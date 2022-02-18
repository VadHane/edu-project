import Router from 'express';
import FileController from '../controllers/FileController.js';

const file = Router();

file.get('/', FileController.getAllFiles);

file.get('/:id', FileController.getFile);

file.post('/', FileController.createFile);

file.put('/:id', FileController.updateFile);

file.delete('/:id', FileController.deleteFile);

export default file;
