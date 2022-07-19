import Router from 'express';
import FileController from '../controllers/FileController.js';
import { signature } from './../config.js';

/**
 * Express router for API. (Path: /api/file/*)
 */
const router = Router();

/**
 * Object with router endpoints.
 */
const controller = new FileController();

router.get('/', signature.verifier(), controller.getAllFiles);

router.get('/:id', signature.verifier(), controller.getFile);

router.post('/', signature.verifier(), controller.createFile);

router.put('/:id', signature.verifier(), controller.updateFile);

router.delete('/:id', signature.verifier(), controller.deleteFile);

export default router;
