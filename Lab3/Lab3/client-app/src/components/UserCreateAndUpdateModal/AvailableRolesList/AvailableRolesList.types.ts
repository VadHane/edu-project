import { Role } from '../../../models/Role';

type AvailableRolesListProps = {
    addedRoles: Array<Role>;
    addRole: (role: Role) => void;
};

export default AvailableRolesListProps;
