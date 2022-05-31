import {User} from '../../../models/User';

export type TableContentRowProps = {
    user: User,
    onDelete: (id: string) => void,
    onEdit: (id: string) => void,
};
