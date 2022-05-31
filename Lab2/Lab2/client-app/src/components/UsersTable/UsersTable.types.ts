import { Role } from '../../models/Role';
import { User } from '../../models/User';

type UsersTableProps = {
    getAllRolesAsync: () => Promise<Array<Role>>;
    createNewRole: (role: Role) => Promise<Role>;
    createUserAsync: (user: User, file: any) => Promise<User>;
};

export default UsersTableProps;
