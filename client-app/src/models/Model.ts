import { ModelHistory } from './ModelHistory';
import { Tag } from './Tag';

export interface Model {
    id: string;
    name: string;
    filekey: string;
    prevBlobKey: string;
    description: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    tags: Array<Tag>;
    modelHistory: Array<ModelHistory>;
}
