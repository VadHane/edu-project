import {Role} from '../../../models/Role';
import {User} from '../../../models/User';

type UserCreateAndUpdateModalProps = {
    user: User,
    btnCaption: string
    getAllRolesAsync: () => Promise<Array<Role>>
    createNewRole: (role: Role) => Promise<Role>
    addUserAsync: (user: User, file: any) => void
}

export default UserCreateAndUpdateModalProps;
