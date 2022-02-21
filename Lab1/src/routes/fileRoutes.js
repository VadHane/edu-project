import Router from 'express';
import FileController from '../controllers/FileController.js';

const router = Router();
const controller = new FileController();

router.get('/', controller.getAllFiles);

router.get('/:id', controller.getFile);

router.post('/', controller.createFile);

router.put('/:id', controller.updateFile);

router.delete('/:id', controller.deleteFile);

export default router;
