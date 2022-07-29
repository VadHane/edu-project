import { IStoreActionCallback } from '../../models/IStoreActionCallback';
import { User } from '../../models/User';

export interface ModelModalProps {
    resultButtonsCaption: string;
    open: boolean;
    user?: User;
    onCloseModalHandler: () => void;
    onSendFormHandler: (user: User, file: File, callback?: IStoreActionCallback) => void;
}
