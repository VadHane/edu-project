import Router from 'express';
import { getSignedUrl } from './../controllers/AuthController.js';

const router = Router();

router.post('/', getSignedUrl);

export default router;
