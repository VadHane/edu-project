import Router from 'express';


const file = Router();

file.get('/', (req, res) => {
    res.status(200).json('Get all file');
});

file.get('/:id', (req, res) => {
    res.status(200).json(`Get file (id = ${req.params.id})`);
});

file.post('/', (req, res) => {
    res.status(200).json('Add some file');
});

file.put('/:id', (req, res) => {
    res.status(200).json(`Update file (id = ${req.params.id})`);
});

file.delete('/:id', (req, res) => {
    res.status(200).json(`Delete file (id = ${req.params.id})`);
});

export default file;
