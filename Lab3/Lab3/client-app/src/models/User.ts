import { Nullable } from '../types/App.types';
import { Role } from './Role';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageBlobKey: Nullable<string>;
    roles: Array<Role>;
    isAdmin: boolean;
}
