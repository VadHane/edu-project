import { Model } from '../../models/Model';

export type ModelTableProps = {
    onAddModelHandler: () => void;
    onEditModelHandler: (model: Model) => () => void;
};
