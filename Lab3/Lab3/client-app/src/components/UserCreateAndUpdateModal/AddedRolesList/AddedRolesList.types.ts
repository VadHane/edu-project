import { Role } from '../../../models/Role';

type AddedRolesListProps = {
    addedRoles: Array<Role>;
    removeAddedRole: (role: Role) => void;
};

export default AddedRolesListProps;
