import { Role } from '../../models/Role';
import { User } from '../../models/User';

type UsersTableProps = {
    getAllUsersAsync: () => Promise<Array<User>>;
    getAllRolesAsync: () => Promise<Array<Role>>;
    createNewRole: (role: Role) => Promise<Role>;
};

export default UsersTableProps;
