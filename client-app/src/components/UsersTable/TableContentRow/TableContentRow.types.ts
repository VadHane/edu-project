import { User } from '../../../models/User';

export type TableContentRowProps = {
    user: User;
    onEditHandler: (user: User) => () => void;
};
