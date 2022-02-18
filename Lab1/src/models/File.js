import Mongoose  from 'mongoose';

const fileSchema = new Mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    metadata: {
        contentType: String,
        contentEncoding: String,
        //CORS rules
        AccessControlAllowMethods: String,
        AccessControlAllowHeaders: String,
        AccessControlAllowOrigin: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    }
});

const file = Mongoose.Model('file', fileSchema);

export default file;
