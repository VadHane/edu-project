export const Config = {
    /** Port for listening by express */
    PORT: 3001,

    /** Connection string to Mongo DB. */
    MONGE_URL: 'mongodb://localhost:27017/Lab1',    
};

/**
 * Headers for the response.
 */
export const resHeaders = {
    'Content-Type': 'application/json',
     /** Url address of UI. */
    'Access-Control-Allow-Origin': 'http://localhost:3005'
};

/**
 * Exeptions for controller and services
 */
export const Exceptions = {
    // controller
    filesWereNotFound: 'Files were not found',


    // services
    incorrectId: 'Id is undefined or null!',
    incorrectFile: 'File is undefined or null!',
    neededFieldsAreMissing: 'File doesn\'t contain needed fields!',
    fileNotImage: 'File is not image!',
};

/**
 * Array of allowed extensions.
 */
export const AllowedExtensions = ['.png', '.jpeg', '.jpg'];

export default Config;
