import {Role} from '../../models/Role';
import {User} from '../../models/User';

type UsersTableProps = {
    getAllRolesAsync: () => Promise<Array<Role>>
    createNewRole: (role: Role) => Promise<Role>
    deleteImageAsync: (imageBlobKey: string) => Promise<number>
    postImageAsync: (image: File) => Promise<string>
    addUserAsync: (user: User, file: File) => Promise<number>
};

export default UsersTableProps;
