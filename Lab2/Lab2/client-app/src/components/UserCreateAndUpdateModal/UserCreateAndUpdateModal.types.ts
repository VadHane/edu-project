import { Role } from '../../models/Role';
import { User } from '../../models/User';

type UserCreateAndUpdateModalProps = {
    buttonContent: string;
    getAllRolesAsync: () => Promise<Array<Role>>;
    getUserById: (id?: string) => User | undefined;
    createNewRole: (role: Role) => Promise<Role>;

    // * Handler for click action for the button of form.
    // ! It can be add or edit operation.
    resultActionAsync: (user: User, file: any) => Promise<boolean>;
};

export default UserCreateAndUpdateModalProps;
