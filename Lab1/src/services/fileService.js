import fs from 'fs';
import DataBase from '../models/File.js';
import path from 'path';

export default class FileService {
    constructor() {
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    }

    async create(newFile) {
        if (!newFile){
            throw Error('File is undefined or null!');
        }
        const fileExtension = path.extname(newFile.name);

        const fileName = Date.now() + fileExtension;
        const filePath = path.resolve('src', 'static', fileName);
        newFile.mv(filePath);

        return await DataBase.create({
            path: filePath,
            metadata: {
                contentType: newFile.mimetype,
                contentEncoding: newFile.encoding,
                //CORS rules
                AccessControlAllowMethods: '*',
                AccessControlAllowHeaders: '*',
                AccessControlAllowOrigin: '*',
            },
        });
    }

    async update(id, updateFile) {
        if (!id) {
            console.log(`Id = ${id};`);
            throw Error('Id is undefined or null!');
        }
        
        if (!updateFile){
            throw Error('File is undefined or null!');
        }

        const document = await DataBase.findOne({_id: id});
        fs.unlink(document.path, (err) => {
            if(err){
                throw Error(err);
            }
        });
        updateFile.mv(document.path);

        return await DataBase.findByIdAndUpdate(id, {
            metadata: {
                contentType: updateFile.mimetype,
                contentEncoding: updateFile.encoding,
            },
            updateAt: Date.now()
        });
    }
}
