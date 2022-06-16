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

/** Middleware for using json answers. */
app.use(express.json());

app.use(
    cors({
        origin: CORS_RES_HEADERS['Access-Control-Allow-Origin'],
    })
);

/** Using router for API. (/api/file/*) */
app.use('/api/file', file);

/** Listen all request from port. */
app.listen(config.PORT, () => {});

/** Default answer for all request, that dont fit for any endpoints.*/
app.all('/*', (req, res) => {
    res.status(400).json('Bad request!');
});
