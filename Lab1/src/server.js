import express from 'express';
import config from './config.js';
import file from './routes/fileRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { CORS_RES_HEADERS } from './constants.js';

/** Express app. */
const app = express();
mongoose.connect(config.MONGO_URL);

/** Middleware for uploading files. */
app.use(fileUpload());

/** Middleware for using JSON answers. */
app.use(express.json());

/** Middleware for CORS rules. */
app.use(
    cors({
        origin: CORS_RES_HEADERS['Access-Control-Allow-Origin'],
    })
);

/** Using router for API. (/api/file/*) */
app.use('/api/file', file);

/** Listen all requests from the port. */
app.listen(config.PORT, () => {});

/** The default answer for all requests, that dont fit any endpoints. */
app.all('/*', (req, res) => {
    res.status(400).json('Bad request!');
});
