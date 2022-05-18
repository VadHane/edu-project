import Mongoose from 'mongoose';

/**
 * Schema of document for collection in Mongo DB.
 */
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

/**
 * Model of collection from Mongo DB.
 * Using this file, u can send any requests to database.
 */
const fileContext = Mongoose.model('file', fileSchema);

export default fileContext;
