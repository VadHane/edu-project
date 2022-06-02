import { Role } from '../../../../models/Role';

type AvailableRolesListProps = {
    roles: Array<Role>;
    addedRoles: Array<Role>;
    addRole: (role: Role) => void;
    createNewRole: (role: Role) => void;
};

export default AvailableRolesListProps;
