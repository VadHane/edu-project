import { User } from '../../models/User';

export const FIRST_NAME_PLACEHOLDER = 'First name';
export const LAST_NAME_PLACEHOLDER = 'Last name';
export const EMAIL_PLACEHOLDER = 'email';
export const PASSWORD_PLACEHOLDER = 'Password';

export const emptyUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    imageBlobKey: null,
    roles: [],
    password: '',
    isAdmin: false,
};
