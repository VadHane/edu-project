import { Tag } from '../../../models/Tag';

export interface AvailableTagsListProps {
    tags: Array<Tag>;
    assignedTag: (tag: Tag) => void;
}
