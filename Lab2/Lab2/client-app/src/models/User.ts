import { Role } from './Role';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageBlobKey: string | null;
    roles: Array<Role>;
}
