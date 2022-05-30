/**
 * Headers for the response.
 */
export const CORS_RES_HEADERS = {
    'Content-Type': 'application/json',
    /** Url address of UI. */
    'Access-Control-Allow-Origin': '*'
};

export const FILES_WERE_NOT_FOUND_TEXT = 'Files were not found';
export const FILE_WAS_NOT_FOUND_TEXT = 'File was not found';

/**
 * Exeptions for controller and services
 */
export const INCORRECT_ID_EXCEPTION = 'Id is undefined or null';
export const INCORRECT_FILE_EXCEPTION = 'File is undefined or null';
export const NEEDED_FIELDS_ARE_MISSING_EXCEPTION = 'File doesn\'t contain needed fields';
export const FILE_NOT_IMAGE_EXCEPTION = 'File is not image';

/**
 * Array of allowed ***image*** extensions.
 */
export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpeg', '.jpg'];
