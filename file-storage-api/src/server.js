import express from 'express';
import config, { checkCertificate, serverOptions } from './config.js';
import file from './routes/fileRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import signedRouter from './routes/signedRoutes.js';
import https from 'https';
import clientCertificateAuth from 'client-certificate-auth';

/** Express app. */
const app = express();
mongoose.connect(config.MONGO_URL);

/** Middleware for uploading files. */
app.use(fileUpload());

/** Middleware for using JSON answers. */
app.use(express.json());

/** Middleware for CORS rules. */
app.use(cors());

app.use(
    '/get-signed-url',
    clientCertificateAuth(checkCertificate),
    signedRouter
);

/** Using router for API. (/api/file/*) */
app.use('/api/file', file);

/** The default answer for all requests, that dont fit any endpoints. */
app.all('/*', (req, res) => {
    res.status(400).json('Bad request!');
});

https.createServer(serverOptions, app).listen(4433);
