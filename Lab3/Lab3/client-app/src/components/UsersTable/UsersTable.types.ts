import { User } from '../../models/User';

export interface UsersTableProps {
    onAddUserHandler: () => void;
    onEditUserHandler: (user: User) => () => void;
}
