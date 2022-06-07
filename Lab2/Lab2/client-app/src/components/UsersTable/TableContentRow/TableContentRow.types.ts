import { User } from '../../../models/User';

export type TableContentRowProps = {
    user: User;
    onDelete: (user: User) => void;
};
