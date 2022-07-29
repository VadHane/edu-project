import { Model } from '../../../models/Model';

export interface TableContentRowProps {
    model: Model;
    onEditModelHandler: (model: Model) => () => void;
}
