import { Role } from '../../../models/Role';

type AddedRolesListProps = {
    roles: Array<Role>;
    removeAddedRole: (role: Role) => void;
};

export default AddedRolesListProps;
