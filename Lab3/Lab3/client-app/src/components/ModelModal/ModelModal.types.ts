import { IStoreActionCallback } from '../../models/IStoreActionCallback';
import { Model } from '../../models/Model';

export interface ModelModalProps {
    resultButtonsCaption: string;
    open: boolean;
    model?: Model;
    onCloseModalHandler: () => void;
    onSendFormHandler: (
        model: Model,
        file: File,
        preview: File,
        callback?: IStoreActionCallback,
    ) => void;
}
