import { Tag } from '../../../models/Tag';

export interface AssignedTagsListProps {
    tags: Array<Tag>;
    removeTag: (tag: Tag) => void;
}
