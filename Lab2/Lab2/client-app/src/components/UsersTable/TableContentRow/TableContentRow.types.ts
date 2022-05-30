import {User} from '../../../models/User';

export type TableContentRowProps = {
    user: User,
    onDelete: (id: string) => any,
    onEdit: (id: string) => any,
};
