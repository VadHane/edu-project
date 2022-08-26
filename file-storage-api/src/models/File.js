import Mongoose from 'mongoose';

/**
 * Schema of document for Mongo DB collection.
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
    },
});

/**
 * Model of Mongo DB collection.
 * Using this instance, u can send any requests to the database.
 */
const fileContext = Mongoose.model('file', fileSchema);

export default fileContext;
