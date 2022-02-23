import express from 'express';
import config from './config.js';
import file from './routes/fileRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';

const app = express();
mongoose.connect(config.MONGE_URL);

app.use(fileUpload());
app.use(express.json());
app.use('/api/file', file);

app.listen(config.PORT, () => {
    console.log('Server is running');
});

app.all('/*', (req, res) => {
    res.status(400).json('Bad request!');
});
