import express from 'express';
import config from './config.js';
import file from './routes/fileRoutes.js';

const app = express();

app.use('/api/file', file);

app.listen(config.PORT, () => {
    console.log('Server is running');
});

app.all('/*', (req, res) => {
    res.status(400).json('Bad request!');
});
