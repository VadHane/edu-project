import React, { FunctionComponent, useEffect, useState } from 'react';
import { REMOVE_IMAGE } from '../../../App.constants';
import { Tag } from '../../../models/Tag';
import { AssignedTagsListProps } from './AssignedTagsList.types';
import './AssignedTagsList.css';

const AssignedTagsList: FunctionComponent<AssignedTagsListProps> = (
    props: AssignedTagsListProps,
) => {
    const [tags, setTags] = useState<Array<Tag>>(props.tags);

    useEffect(() => {
        setTags([...props.tags]);
    }, [props.tags]);

    return (
        <div className="tags-list">
            {tags?.map((tag: Tag) => (
                <div className="list-row" key={tag.id}>
                    <span>
                        {tag.name}
                        <img
                            src={REMOVE_IMAGE.URL}
                            alt={REMOVE_IMAGE.ALT}
                            onClick={() => props.removeTag(tag)}
                        />
                    </span>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default AssignedTagsList;
