/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';

export const Config = {
    /** Port for listening by express */
    PORT: 3008,

    /** The connection string to Mongo DB. */
    MONGO_URL: 'mongodb://localhost:27017/Lab1',
};

export const serverOptions = {
    key: fs.readFileSync(
        path.join(__dirname, '..', 'certificates', 'server', 'server_key.pem')
    ),
    cert: fs.readFileSync(
        path.join(__dirname, '..', 'certificates', 'server', 'server_cert.pem')
    ),
    requestCert: true,
    rejectUnauthorized: false, // so we can do own error handling
    ca: [
        fs.readFileSync(
            path.join(
                __dirname,
                '..',
                'certificates',
                'server',
                'server_cert.pem'
            )
        ),
    ],
};

export const checkCertificate = (cert) => {
    return cert.subject.CN === 'vhanevych';
};

export default Config;
