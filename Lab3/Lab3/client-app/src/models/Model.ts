import { ModelHistory } from './ModelHistory';
import { Tag } from './Tag';

export interface Model {
    id: string;
    name: string;
    fileKey: string;
    previewBlobKey: string;
    description: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    tags: Array<Tag>;
    history: Array<ModelHistory>;
}
