import { Nullable } from '../types';
import { Role } from './Role';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageBlobKey: Nullable<string>;
    roles: Array<Role>;
}
