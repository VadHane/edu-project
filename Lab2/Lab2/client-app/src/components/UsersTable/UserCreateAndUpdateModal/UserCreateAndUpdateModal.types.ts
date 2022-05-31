import { Role } from '../../../models/Role';
import { User } from '../../../models/User';

type UserCreateAndUpdateModalProps = {
    user: User;
    btnCaption: string;
    getAllRolesAsync: () => Promise<Array<Role>>;
    createNewRole: (role: Role) => Promise<Role>;

    // * Handler for click action for the button of form.
    // ! It can be add or edit operation.
    resultActionAsync: (user: User, file: any) => Promise<boolean>;
};

export default UserCreateAndUpdateModalProps;
